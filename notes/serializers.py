

from rest_framework import serializers
from .models import Note, Song, Comment
from django.contrib.auth import get_user_model
User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username') 

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ('id', 'note', 'sound', 'sound_file')

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Song
        fields = ('id', 'title', 'user', 'times', 'notes', 'song_file')

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'user', 'song', 'text', 'time_stamp')

# class PopulatedSongSerializer(SongSerializer):
#     note = CategorySerializer(many=True)

