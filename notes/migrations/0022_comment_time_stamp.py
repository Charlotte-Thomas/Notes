# Generated by Django 3.0.4 on 2020-04-02 15:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0021_remove_comment_time_stamp'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='time_stamp',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
