from django.shortcuts import render

# Create your views here.
from django.http import HttpResponseRedirect
from django.views.generic import FormView

from django.conf import settings

from rest_framework.views import APIView  # get the APIView class from DRF
from rest_framework.response import Response  # get the Response class from DRF
from rest_framework.status import HTTP_201_CREATED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_204_NO_CONTENT, HTTP_401_UNAUTHORIZED

# from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated

from .models import Note, Song, User
from .serializers import NoteSerializer, SongSerializer, UserSerializer

from pydub import AudioSegment
import os  
from os.path import abspath, basename, dirname, join, normpath

class UserView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class NoteView(APIView):
  # added permission_classes to views which need authentication 
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        notes = Note.objects.all()
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

class SongView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        songs = Song.objects.all()
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        request.data['user'] = request.user.id
        song = SongSerializer(data=request.data)
        allNotes = Note.objects.all()
        print('requesssst', request.data)
        print('noteeees', allNotes[0])
        array = request.data['notes']
        for note in array:
          notes = []
          for audio in note:
            notes.append(audio)
            print(audio)
        # print(song.data.notes)
        if song.is_valid():
            song.save()
            return Response(song.data, status=HTTP_201_CREATED)
        print('err', song.errors)
        return Response(song.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)


class SingleNoteView(APIView):
    def get(self, request, pk):
        note = Note.objects.get(pk=pk)
        serializer = NoteSerializer(note)
        return Response(serializer.data)

class SingleSongView(APIView):
    def get(self, request, pk):
        song = Song.objects.get(pk=pk)
        serializer = SongSerializer(song)
        return Response(serializer.data)
    
    def delete(self, request, pk):
        song = Song.objects.get(pk=pk)
        serializer = SongSerializer(song)
        song.delete()
        return Response(serializer.data)
    

class SingleUserView(APIView):
    def get(self, request, pk):
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)



# notes_root = settings.MEDIA_ROOT + '/notes'
# my_file = os.path.join(notes_root, 'after.wav')
# my_save = os.path.join(notes_root, 'after2.wav')


# sound1 = AudioSegment.from_wav(my_file)
# sound2 = AudioSegment.from_wav(my_file)

# combined_sounds = sound1 + sound2
# combined_sounds.export(my_save, format="wav")



# /Users/charlottethomas/development/projects/Notes/notes