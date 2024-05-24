from rest_framework.decorators import api_view, permission_classes

from post.models import Post

from .models import *
from .profile_serializers import *
from rest_framework import response
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes


# create a user
@api_view(["POST"])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def createUser(request):
    user_data = request.data
    try:
        other_user = User.objects.get(username=user_data["username"])
        return Response(status=400)
    except:
        new_user = {
            "username": user_data['username'],
            "password": user_data["password"],
            "email": user_data['email'],
        }
        try:
            user = User.objects.create_user(**new_user)
            savedUser = User.objects.get(username=user.username)
            profile = Profile.objects.create(
                user=savedUser, image=user_data.get("image",None))
            return Response(status=201)
        except Exception as error:
            print(error)
            return Response(status=401)


@api_view(["GET"])
@parser_classes([MultiPartParser, FormParser])
@permission_classes([IsAuthenticated])
def getCurrentUser(request):
    user = request.user
    profile = Profile.objects.get(user=user)
    # profile.user = model_to_dict(profile.user)
    return Response(
        # content_type="application/x-www-form-urlencoded",
        data={
            "username": profile.user.username,
            "email": profile.user.email,
            "image": profile.image.url,
            "role": "ADMIN" if profile.user.is_staff else "USER"
        },
        status=200
    )


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def deleteUser(request, pk):
    if not request.user.is_superuser:
        return Response(status=403)
    user = User.objects.get(id=pk)
    user.delete()
    return Response(status=200)


# follow a user
@api_view(["POST", 'DELETE'])
@permission_classes([IsAuthenticated])
def followApi(request, pk):
    if request.method == "POST":
        follower = request.user
        followed = User.objects.get(id=pk)
        try:
            prev = Following.objects.filter(follower=follower, followed=followed)
            if prev.count()>0:
                return Response(status=400)
            Following.objects.create(follower=follower, followed=followed)
            return Response(status=200)
        except:
            return Response(status=500)
    elif request.method == "DELETE":
        try:
            follower = request.user.id
            obj = Following.objects.get(follower=follower, followed=pk)
            obj.delete()
            return Response(status=200)
        except:
            return Response(status=400)

# returns list of users that the current user follows


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def following(request):
    try:
        peopleFollowed = Following.objects.filter(follower=request.user)
        serializer = UserSerializer(peopleFollowed,many = True,context={'request':request})
        return Response(serializer.data)
    except:
        return Response(status=500)
# returns the list of users that follow the current user


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def followers(request):
    try:
        followers = Following.objects.filter(followed=request.user)
        serializer = UserSerializer(followers,many = True,context={'request':request})
        return Response(serializer.data)
    except:
        return Response(status=500)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def allUsers(request):
    try:
        users = User.objects.exclude(username = request.user.username)
        serializer = UserSerializer(users,many=True,context={'request':request})
        return Response(serializer.data)
    except Exception as e:
        return Response(status=500)


# return the general statics for the admin panel containing the following informations
# Total_posts
# Average_posts_per_day
# Total_posts_with_hate
# Proportion_of_hatefulposts_deleted_by_admin
# Aveage_posts_per_user
# Aveage_followers_per_user

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def generalStatistics(request):
    if not request.user.is_superuser:
        return Response(status=403)
    try:
        hatefulCount = Post.objects.filter(is_hateful = True).count()
        totalPostCount = Post.objects.all().count()
        totalUser = User.objects.all().count()
        followingCount = Following.objects.all().count()
    except:
        return Response(status=500)
    prev = None
    dateCount = 0
    for post in Post.objects.all():
        if post.created.date()!=prev:
            dateCount+=1
        prev = post.created.date()
    context = {
        'total_posts':totalPostCount,
        'average_posts_per_day':totalPostCount/dateCount,
        'total_posts_with_hate':hatefulCount,
        'proportion_of_hatespeeches':hatefulCount/totalPostCount,
        'average_posts_per_user':totalPostCount/totalUser,
        'average_follower_per_user':followingCount/totalUser
        
    }
    return Response(data=context)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserPostCounts(request):
    if not request.user.is_superuser:
        return Response(status=403)
    users = User.objects.all()
    serilizer = UserPostSerializer(users,many = True)
    return Response(serilizer.data)