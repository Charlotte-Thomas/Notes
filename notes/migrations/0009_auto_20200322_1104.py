# Generated by Django 3.0.4 on 2020-03-22 11:04

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0008_auto_20200322_1056'),
    ]

    operations = [
        migrations.AddField(
            model_name='song',
            name='times',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=200), blank=True, null=True, size=None),
        ),
        migrations.RemoveField(
            model_name='song',
            name='notes',
        ),
        migrations.AddField(
            model_name='song',
            name='notes',
            field=models.ManyToManyField(related_name='notes', to='notes.Note'),
        ),
        migrations.DeleteModel(
            name='Dicty',
        ),
    ]
