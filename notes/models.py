from django.db import models

from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.
class Note(models.Model):
    note = models.CharField(max_length=200)
    sound_file = models.FileField(upload_to='notes', null=True)

    def __str__(self):
        return f'{self.note} - {self.sound_file}'

class Song(models.Model):
    title = models.CharField(max_length=60)
    user =  models.ForeignKey(User, related_name='notes', on_delete=models.CASCADE, null=True)
    notes = models.ManyToManyField(Note, related_name='notes')

    def __str__(self):
        return f'{self.title}'