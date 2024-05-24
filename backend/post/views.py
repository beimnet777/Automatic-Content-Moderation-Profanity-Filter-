from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from .models import Post, Comment, Like
from .postSerializers import PostSerializer, CommentSerializer
import os
import pickle
import tensorflow as tf
import tempfile
import librosa
import torch
from transformers import Wav2Vec2ForCTC, AutoProcessor
from django.core.files.uploadedfile import InMemoryUploadedFile

# Load tokenizer and model for text classification
with open(os.path.join("ML_MODEL", "tokenizer.pickle"), "rb") as handle:
    sentence_tokenizer = pickle.load(handle)

amharicModel = tf.keras.models.load_model(
    "ML_MODEL/amharic.h5", custom_objects=None, compile=True, options=None
)

englishModel = tf.keras.models.load_model(
    "ML_MODEL/english.h5", custom_objects=None, compile=True, options=None
)


# ASR function
def asr(file_name):
    model_id = "facebook/mms-1b-fl102"
    tokenizer = AutoProcessor.from_pretrained(model_id)
    model = Wav2Vec2ForCTC.from_pretrained(model_id)
    tokenizer.tokenizer.set_target_lang("amh")
    model.load_adapter("amh")

    input_audio, _ = librosa.load(file_name, sr=16000)
    input_values = tokenizer(input_audio, return_tensors="pt").input_values
    logits = model(input_values).logits
    predicted_ids = torch.argmax(logits, dim=-1)
    text = tokenizer.batch_decode(predicted_ids)[0]

    return text


# detect language of text
def detect_language(text):
    # Check if the text contains only ASCII characters
    if all(ord(char) < 128 for char in text):
        return "English"

    # Check if the text contains Amharic characters
    amharic_chars = "".join([chr(i) for i in range(4608, 4879)])
    if any(char in amharic_chars for char in text):
        return "Amharic"

    # If the text contains neither ASCII nor Amharic characters, return 'Unknown'
    return "Unknown"


# Endpoint for creating and fetching posts
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def postApi(request):
    if request.method == "GET":
        try:
            posts = Post.objects.filter(Q(user=request.user) | Q(is_hateful=False))
            serializer = PostSerializer(posts, context={"request": request}, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(e, "the error")
            return Response(status=500)

    elif request.method == "POST":
        postData = request.data
        image, audio = None, None
        try:
            image = postData["image"]
        except KeyError:
            pass

        try:
            audio = postData["audio"]
        except KeyError:
            pass

        content = postData["content"]
        user = request.user

        max_length = 50
        sequences = sentence_tokenizer.texts_to_sequences([content])
        padded_sequence = tf.keras.preprocessing.sequence.pad_sequences(
            sequences, maxlen=max_length, padding="pre", truncating="pre"
        )
        # Classify the text content
        if detect_language(content) == "English":
            prediction_text = englishModel.predict(padded_sequence)
            isHatefulText = prediction_text[0][0] > 0.75
        else:
            prediction_text = amharicModel.predict(padded_sequence)
            isHatefulText = prediction_text[0][0] > 0.75

        # Initialize isHatefulAudio to False
        isHatefulAudio = False

        # Process and classify the audio content if available
        if audio and isinstance(audio, InMemoryUploadedFile):
            with tempfile.NamedTemporaryFile(
                delete=False, suffix=".wav"
            ) as temp_audio_file:
                for chunk in audio.chunks():
                    temp_audio_file.write(chunk)
                temp_audio_path = temp_audio_file.name

            try:
                transcribed_text = asr(temp_audio_path)
                sequences_audio = sentence_tokenizer.texts_to_sequences(
                    [transcribed_text]
                )
                padded_sequence_audio = tf.keras.preprocessing.sequence.pad_sequences(
                    sequences_audio, maxlen=max_length, padding="pre", truncating="pre"
                )
                if detect_language(transcribed_text) == "English":
                    prediction_audio = englishModel.predict(padded_sequence_audio)
                    isHatefulAudio = prediction_audio[0][0] > 0.75
                else:
                    prediction_audio = englishModel.predict(padded_sequence_audio)
                    isHatefulAudio = prediction_audio[0][0] > 0.75

            finally:
                os.remove(temp_audio_path)

        isHateful = isHatefulText or isHatefulAudio

        try:
            Post.objects.create(
                image=image,
                audio=audio,
                content=content,
                user=user,
                is_hateful=isHateful,
            )
            return Response(status=201)
        except Exception as e:
            print(e, "the error")
            return Response(status=500)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def deletePost(request, pk):
    postCreator = Post.objects.get(id=pk).user
    currUser = request.user
    # print(currUser, postCreator, "fjdskl")
    if currUser.is_staff or currUser == postCreator:
        try:
            post = Post.objects.get(id=pk)
            post.delete()
            return Response(status=200)
        except:
            return Response(status=500)
    else:
        return Response(status=403)


# returns the list of posts created by the user
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getMyPosts(request):
    try:
        myPosts = Post.objects.filter(user=request.user)
        serializer = PostSerializer(myPosts, context={"request": request}, many=True)
        return Response(serializer.data)
    except:
        return Response(status=500)


# returns the list of posts that contain hate speeches for the admin
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getHatefulPosts(request):
    if not request.user.is_superuser:
        return Response(status=403)
    try:
        posts = Post.objects.filter(is_hateful=True)
        serilizer = PostSerializer(posts, context={"request": request}, many=True)
        return Response(serilizer.data)
    except:
        return Response(status=500)


# create a comment on a post
@api_view(["POST", "GET"])
@permission_classes([IsAuthenticated])
def commentApi(request, pk):
    if request.method == "POST":
        try:
            post = Post.objects.get(id=pk)
            comment = Comment.objects.create(
                content=request.POST["content"], post=post, user=request.user
            )
            return Response(status=201)
        except Exception as e:
            return Response(status=500)
    elif request.method == "GET":
        try:
            comments = Comment.objects.filter(post=pk)
            serializer = CommentSerializer(
                comments, many=True, context={"request": request}
            )
            return Response(serializer.data)
        except Exception as e:
            print(e)
            return Response(status=500)
    else:
        return Response(status=400)


# delete a comment
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def deleteComment(request, pk):
    try:
        commentCreator = Comment.objects.get(id=pk).user
        currUser = request.user
    except Exception as e:
        return Response(status=500)
    if currUser.is_superuser or currUser == commentCreator:
        try:
            comment = Comment.objects.get(id=pk)
            comment.delete()
            return Response(status=200)
        except:
            return Response(status=500)
    else:
        return Response(status=403)


# create a like on a post
@api_view(["POST", "DELETE"])
@permission_classes([IsAuthenticated])
def likeApi(request, pk):
    post = Post.objects.get(id=pk)
    if request.method == "POST":
        try:
            previous = Like.objects.filter(post=post)
            if len(previous) > 0:
                return Response(status=400)
            Like.objects.create(post=post, user=request.user)
            return Response(status=200)
        except:
            return Response(status=500)
    elif request.method == "DELETE":
        try:
            like = Like.objects.get(post=post, user=request.user)
            like.delete()
            return Response(status=200)
        except Exception as e:
            return Response(status=400)
    else:
        return Response(status=400)
