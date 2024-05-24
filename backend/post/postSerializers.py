from user.models import Profile
from .models import *
from rest_framework.serializers import ModelSerializer, SerializerMethodField


class PostSerializer(ModelSerializer):
    is_liked = SerializerMethodField()
    user = SerializerMethodField()

    def get_is_liked(self, object):
        request = self.context.get('request', None)
        if request is not None:
            liked = Like.objects.filter(post=object, user=request.user)
        else:
            liked = []
        return len(liked) > 0

    def get_user(self, object):
        request = self.context.get('request', None)
        user = request.user
        try:
            image = Profile.objects.get(user = user).image.url
        except:
            image = None
        return {"username":user.username,"id":user.id,'image':image}

    class Meta:
        model = Post
        fields = ['image', 'audio', 'content', 'user',
                  'is_hateful', 'id', 'created', 'is_liked']


class CommentSerializer(ModelSerializer):
    user = SerializerMethodField()

    def get_user(self, object):
        user = object.user
        print(user)
        profile = Profile.objects.filter(user = user)
        if len(profile) == 0:
            image = ""
        else:
            image = profile[0].image.url
        return {"username":user.username,"id":user.id,'image': image}
    class Meta:
        model = Comment
        fields = ['content','user','post', 'id', "created"]
