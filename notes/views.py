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

from .models import Note, Song, User, Comment
from .serializers import NoteSerializer, SongSerializer, UserSerializer, CommentSerializer

import ffmpeg
from pydub import AudioSegment
import os  
from os.path import abspath, basename, dirname, join, normpath

notes_root = settings.MEDIA_ROOT + '/notes'

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


class CommentView(APIView):
    def get(self, request):
        comment = Comment.objects.all()
        serializer = CommentSerializer(comment, many=True)
        return Response(serializer.data)

    def post(self, request):
        request.data['user'] = request.user.id
        comment = CommentSerializer(data=request.data)
        if comment.is_valid():
            comment.save()
            return Response(comment.data, status=HTTP_201_CREATED)
        return Response(comment.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)


class SongView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        songs = Song.objects.all()
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        request.data['user'] = request.user.id
        allNotes = Note.objects.get(pk=1)
        # print('requesssst', request.data)
        # print('noteeeesdataaa', NoteSerializer(allNotes).data['sound_file'])
        allColumns = []
        array = request.data['notes'] 
        my_save = os.path.join(notes_root, request.data['title'] + '.wav')
        for note in array:
          notes = []
          for audio in note: # always 3 MAX (num of rows)
            if audio:
              currentNote = Note.objects.get(pk=audio)
              url =  NoteSerializer(currentNote).data['sound_file'].split('/')[4]
              notes.append(url)

          audioSegs = []
          for file in notes:
            my_file = os.path.join(notes_root, file)
            sound = AudioSegment.from_wav(my_file)
            audioSegs.append(sound)

          # make sure all audio files are same length otherwise overlay will cut the second note short
          if len(audioSegs) > 0:  
            for i in range(len(audioSegs)):
              if i != len(audioSegs) - 1:
                overlayed = audioSegs[i].overlay(audioSegs[i + 1])
                audioSegs[i + 1] = overlayed
            allColumns.append(audioSegs[len(audioSegs) - 1])
            # print(allColumns)

        if len(allColumns) > 0:
          for i in range(len(allColumns)):
            if i != len(allColumns) - 1:
              added = allColumns[i] + allColumns[i + 1]
              allColumns[i + 1] = added
          # print(allColumns)
          final_sound = allColumns[len(allColumns) - 1]
          final_sound.duration_seconds == 150
          final_sound.export(my_save, format="wav")
        
        request.data['song_file'] = '/api/media/notes/' + request.data['title'] + '.wav'
        song = SongSerializer(data=request.data)

        if song.is_valid():
            song.save()
            return Response(song.data, status=HTTP_201_CREATED)
        # print('err', song.errors)
        return Response(song.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)


class SingleNoteView(APIView):
    def get(self, request, pk):
        note = Note.objects.get(pk=pk)
        serializer = NoteSerializer(note)
        return Response(serializer.data)

    def delete(self, request, pk):
        note = Note.objects.get(pk=pk)
        serializer = NoteSerializer(note)
        note.delete()
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

    def put(self, request, pk):
        # will update the song file with new file if title is same name otherwise will create new file with diffrent title as name
        song = Song.objects.get(pk=pk)

        allNotes = Note.objects.get(pk=1)

        allColumns = []
        array = request.data['notes'] 
        my_save = os.path.join(notes_root, request.data['title'] + '.wav')
        for note in array:
          notes = []
          for audio in note: # always 3 MAX (num of rows)
            if audio:
              currentNote = Note.objects.get(pk=audio)
              url =  NoteSerializer(currentNote).data['sound_file'].split('/')[4]
              notes.append(url)

          audioSegs = []
          for file in notes:
            my_file = os.path.join(notes_root, file)
            sound = AudioSegment.from_wav(my_file)
            audioSegs.append(sound)

          if len(audioSegs) > 0:  
            for i in range(len(audioSegs)):
              if i != len(audioSegs) - 1:
                overlayed = audioSegs[i].overlay(audioSegs[i + 1])
                audioSegs[i + 1] = overlayed
            allColumns.append(audioSegs[len(audioSegs) - 1])

        if len(allColumns) > 0:
          for i in range(len(allColumns)):
            if i != len(allColumns) - 1:
              added = allColumns[i] + allColumns[i + 1]
              allColumns[i + 1] = added
   
          final_sound = allColumns[len(allColumns) - 1]
          final_sound.duration_seconds == 150
          final_sound.export(my_save, format="wav")
        
        request.data['song_file'] = '/api/media/notes/' + request.data['title'] + '.wav'


        updated_song = SongSerializer(song, data=request.data)
        print('UPDATED', updated_song)
        if (updated_song.is_valid()):
            updated_song.save()
            return Response(updated_song.data)
        return Response(updated_song.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)
    

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