from django.db import models

from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
User = get_user_model()

# Create your models here.
class Note(models.Model):
    note = models.CharField(max_length=200, unique=True, null=True)
    sound_file = models.FileField(upload_to='notes', null=True)

    def __str__(self):
        return f'{self.note} - {self.sound_file}'

class Song(models.Model):
    title = models.CharField(max_length=60, unique=True)
    user =  models.ForeignKey(User, related_name='notes', on_delete=models.CASCADE, null=True)
    times = ArrayField(models.CharField(max_length=200), blank=True, null=True)
    notes = ArrayField(ArrayField(models.IntegerField(blank=True, null=True), blank=True, null=True), blank=True, null=True)
    song_file = models.CharField(max_length=100,  blank=True, null=True)
    # song_file = print('/api/notes/' + str(title) + '.wav')

    def __str__(self):
        return f'{self.title}'