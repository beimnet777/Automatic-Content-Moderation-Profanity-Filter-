# Generated by Django 4.1.4 on 2023-02-14 10:36

from django.db import migrations, models
import user.models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_alter_profilepicture_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profilepicture',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=user.models.upload_to),
        ),
    ]
