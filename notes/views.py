from django.shortcuts import render

# Create your views here.
from django.http import HttpResponseRedirect
from django.views.generic import FormView

from django.conf import settings

from rest_framework.views import APIView  # get the APIView class from DRF
from rest_framework.response import Response  # get the Response class from DRF
from rest_framework.status import HTTP_201_CREATED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_204_NO_CONTENT, HTTP_401_UNAUTHORIZED

# from rest_framework.authentication import SessionAuthentication, BasicAuthentication
# from rest_framework.permissions import IsAuthenticated

from .models import Note, Song, User
from .serializers import NoteSerializer, SongSerializer, UserSerializer

class UserView(APIView):
    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

class NoteView(APIView):
  # added permission_classes to views which need authentication 
  # didn't need this with other projects, not sure what i've missed
    # permission_classes = [IsAuthenticated]
    def get(self, request):
        notes = Note.objects.all()
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

class SongView(APIView):
    def get(self, request):
        songs = Song.objects.all()
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        request.data['user'] = request.user.id
        song = SongSerializer(data=request.data)
        if song.is_valid():
            song.save()
            return Response(song.data, status=HTTP_201_CREATED)
        return Response(song.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)
