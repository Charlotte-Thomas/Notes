# Generated by Django 3.0.4 on 2020-03-21 17:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0002_auto_20200321_1704'),
    ]

    operations = [
        migrations.AddField(
            model_name='song',
            name='notes',
            field=models.ManyToManyField(related_name='notes', to='notes.Note'),
        ),
    ]
