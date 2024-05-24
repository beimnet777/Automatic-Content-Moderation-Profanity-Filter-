from post.models import Post
from .models import *
from rest_framework.serializers import ModelSerializer,SerializerMethodField


class ProfileSerializer(ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'
    

class UserSerializer(ModelSerializer):
    is_followed = SerializerMethodField()
    image = SerializerMethodField()

    def get_is_followed(self,object):
        request = self.context.get('request',None)
        relation = Following.objects.filter(follower=request.user,followed=object)
        if len(relation) > 0:
            return True
        return False
    def get_image(self,object):
        profile = Profile.objects.filter(user = object)
        return profile[0].image.url if len(profile) > 0 else None

    class Meta:
        model = User
        fields = ['username','id','is_followed','email','image']

class UserPostSerializer(ModelSerializer):
    post_count = SerializerMethodField()
    hateful_post_count = SerializerMethodField()

    def get_post_count(self,object):
        return Post.objects.filter(user=object).count()

    def get_hateful_post_count(self,object):
        return Post.objects.filter(user=object,is_hateful=True).count()
    
    class Meta:
        model = User
        fields = ['id','username','post_count','hateful_post_count']




