from django.urls import path
from . import views


urlpatterns = [
    path('posts/my/',views.getMyPosts),
    path('posts/',views.postApi),
    path('posts/<str:pk>/',views.deletePost),
    path('posts/admin/hateful/',views.getHatefulPosts),
    path('posts/comments/<str:pk>/',views.commentApi),#post id
    path('comments/<str:pk>/',views.deleteComment),#comment id
    path('likes/<str:pk>/',views.likeApi),
]