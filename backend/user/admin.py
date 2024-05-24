from django.contrib import admin
from .models import *
from django.contrib.auth.models import User

class UserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "password")

class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "image")

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Following)