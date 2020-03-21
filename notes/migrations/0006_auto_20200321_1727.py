# Generated by Django 3.0.4 on 2020-03-21 17:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0005_song_notes'),
    ]

    operations = [
        migrations.AlterField(
            model_name='note',
            name='note',
            field=models.CharField(max_length=200),
        ),
        migrations.AlterField(
            model_name='note',
            name='soundFile',
            field=models.FileField(null=True, upload_to='notes'),
        ),
    ]
