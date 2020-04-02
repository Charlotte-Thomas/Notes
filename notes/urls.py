from django.urls import path
from .views import NoteView, SongView, UserView, SingleNoteView, SingleSongView, SingleUserView, CommentView

urlpatterns = [
    # path('', ListView.as_view()),
    # path('<int:pk>/', DetailView.as_view()),
    path('notes/', NoteView.as_view()),
    path('songs/', SongView.as_view()),
    path('users/', UserView.as_view()),
    path('comments/', CommentView.as_view()),
    path('notes/<int:pk>/', SingleNoteView.as_view()),
    path('songs/<int:pk>/', SingleSongView.as_view()),
    path('users/<int:pk>/', SingleUserView.as_view()),
]