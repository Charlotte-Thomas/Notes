from django.shortcuts import render

# Create your views here.
from django.http import HttpResponseRedirect
from django.views.generic import FormView

from django.conf import settings

from rest_framework.views import APIView  # get the APIView class from DRF
from rest_framework.response import Response  # get the Response class from DRF
from rest_framework.status import HTTP_201_CREATED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_204_NO_CONTENT, HTTP_401_UNAUTHORIZED

from .models import Note, Song
from .serializers import NoteSerializer, SongSerializer

class NoteView(APIView):
    def get(self, request):
        notes = Note.objects.all()
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)

class SongView(APIView):
    def get(self, request):
        songs = Song.objects.all()
        serializer = SongSerializer(songs, many=True)
        return Response(serializer.data)
