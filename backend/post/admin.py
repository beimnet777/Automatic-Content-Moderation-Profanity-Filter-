from django.contrib import admin
from .models import *

class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "content", "user", "post")

class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "content", "user", "image", "is_hateful", "created")

class LikeAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "post")

admin.site.register(Comment, CommentAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(Like, LikeAdmin)