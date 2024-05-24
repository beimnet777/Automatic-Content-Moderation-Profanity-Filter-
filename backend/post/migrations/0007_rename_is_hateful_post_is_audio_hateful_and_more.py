# Generated by Django 4.1.7 on 2024-05-24 19:45

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("post", "0006_alter_comment_options_alter_post_options_post_audio"),
    ]

    operations = [
        migrations.RenameField(
            model_name="post",
            old_name="is_hateful",
            new_name="is_audio_hateful",
        ),
        migrations.AddField(
            model_name="post",
            name="is_content_hateful",
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
    ]