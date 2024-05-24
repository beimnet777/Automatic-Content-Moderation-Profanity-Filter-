from django.urls import path
from . import views


urlpatterns = [
    path('users/',views.createUser),
    path('users/all/',views.allUsers),
    path('users/<str:pk>/',views.deleteUser),
    path('profile/',views.getCurrentUser),
    path('users/follow/<str:pk>/',views.followApi),
    path('admin-stat/',views.generalStatistics),
    path('admin-user-stat/',views.getUserPostCounts)

    
]