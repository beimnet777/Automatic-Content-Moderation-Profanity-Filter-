# Generated by Django 4.1.4 on 2023-02-14 10:44

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('user', '0003_alter_profilepicture_image'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ProfilePicture',
            new_name='Profile',
        ),
    ]
