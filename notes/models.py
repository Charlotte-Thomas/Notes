from django.db import models

# Create your models here.
class Note(models.Model):
    title = models.CharField(max_length=50)
    sound = models.CharField(max_length=200)

    def __str__(self):
        return f'{self.title} - {self.sound}'

class Song(models.Model):
    title = models.CharField(max_length=50)
    sound = models.CharField(max_length=200)

    def __str__(self):
        return f'{self.title} - {self.sound}'