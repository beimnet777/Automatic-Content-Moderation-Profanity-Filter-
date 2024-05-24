from django.db import models
from django.contrib.auth.models import User
import datetime

# Create your models here.
def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)

class Post(models.Model):
    image = models.ImageField(blank=True,null=True,upload_to=upload_to)
    audio = models.FileField(blank=True, null=True, upload_to=upload_to)
    content = models.TextField()
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    is_hateful = models.BooleanField()
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.content} - Post"
    
    class Meta:
        ordering = ['-created']


class Comment(models.Model):
    content = models.TextField()
    post = models.ForeignKey(Post,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        return f"{self.content} - comment"
    
    class Meta:
        ordering = ['-created']

class Like(models.Model):
    post = models.ForeignKey(Post,on_delete=models.CASCADE)
    user = models.ForeignKey(User,on_delete=models.CASCADE)

    def __str__(self) -> str:
        return super().__str__()

