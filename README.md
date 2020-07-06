# **NOTES**

## Overview

You can launch the app on Heroku [here](https://notes-music.herokuapp.com/).

Notes is a Full Stack Django REST application with a React front-end, Python back-end and a PostgreSQL database.

Notes is a creative platform that allows users to create and share their own music using an in-built music player with a selection of sound samples.

##### Main Feature:
Using the order of sound samples that the user has defined in the music creator, the back-end will concatenate and overlay the sounds into a single audio file (.wav) for the user to listen to once the song is saved.



## Brief

* Build a full-stack application by making your own backend and your own front-end
* Use a **Python Django API using Django REST Framework** to serve data from a Postgres database
* Consume your API with a separate front-end built with React
* Be a complete product which most likely means multiple relationships and **CRUD functionality** for at least a couple of models
* Have more back-end features which invlove importing python packages in order to improve Django and Python skills.

## Technology Used

> HTML5   
> CSS3    
> Python    
> Django  
> PostgreSQL   
> JavaScript (ES6)   
> React.js   
> Node.js  
> pydub (to manipulate audio on back-end)
> Material-UI  
> GarageBand (sample creation) 
> Webpack  
> Heroku    
> Git  
> GitHub

## Approach

### Inital Steps

I drew up a plan of the features I wanted to incorporate into the application and then created a data model.

These models included:   
- Note  
- Song   
- Comment  
- User
 
### Back-End

For the PostgreSQL database I set up a table for the four models.

###### User model

For the users, we extended the basic User provided by Django to also include an email field.

###### Note model

The Note model included the name of the sound which would be shown to the user and the API url needed to obtain that song from the media folder.

Audio files for each sound bite were created on GarageBand.

	class Note(models.Model):
	    note = models.CharField(max_length=200, unique=True, null=True)
	    sound_file = models.CharField(max_length=500, blank=True, null=True)


For the notes, I created a fixtures.json file to store the data in order to seed it back into the database when needed and for use after deployment.

###### Song model

The Image model included the information needed in order for the single song file to be created. This was done by creating an array-of-arrays for the ID's of notes. The inner array being the notes in the same column which would be overlayed and the outer array being the order of columns to be concatenated.

It also has a one-to-many relationship with the user who created the song and the API url needed to obtain that song from the media folder.

	class Song(models.Model):
	    title = models.CharField(max_length=60, unique=True)
	    user =  models.ForeignKey(User, related_name='notes', on_delete=models.CASCADE, null=True)
	    times = ArrayField(models.CharField(max_length=200), blank=True, null=True)
	    notes = ArrayField(ArrayField(models.IntegerField(blank=True, null=True), blank=True, null=True), blank=True, null=True)
	    song_file = models.CharField(max_length=100, blank=True, null=True)
 
###### Comment model

The Comment model was designed to store all the comments that users have made on other artists songs.

	class Comment(models.Model):
	    user = models.ForeignKey(User, related_name='notes1', on_delete=models.CASCADE, null=True)
	    song = models.ForeignKey(Song, related_name='notes1', on_delete=models.DO_NOTHING, null=True)
	    text = models.CharField(max_length=200, blank=False, null=True)
	    time_stamp = models.DateTimeField(auto_now_add=True, null=True)


### API End-points

`register/ `(POST)   
Once a user enters the required data a POST request is made. If the data is valid then it will be stored into the database in the User table.

`login/` (POST)  
Once a POST request is made on this route and the input is valid, a response will be given, providing a JWT token.

`users/`(GET)  
Returns a list of the users on the site.

`notes/` (GET | POST)  
The GET request provides a list of all the sound samples.  
The POST request allows a new sound file be saved to the back-end in the 'notes' folder. It also saves the route to that sound file in the database.

This was possible setting up media files in Django:

	MEDIA_URL = '/api/media/'
	MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
	
	FILE_UPLOAD_HANDLERS = ["django.core.files.uploadhandler.MemoryFileUploadHandler",
	 "django.core.files.uploadhandler.TemporaryFileUploadHandler"]
        
                     
`songs/` (GET | POST)  
The GET request provides a list of all the songs users have made on the platform.   
The POST request allows users to save their song to the database and a single song file to be created and saved to the 'songs' folder.

When a POST request is made, a series of loop sequences are performed in order to overlay and concatenate the note files in the correct order into a single audio file. The audio manipulation was possible by using the **pydub** package.

Snippet of the POST request:
		
      if len(audioSegs) > 0:  
	    for i in range(len(audioSegs)):
	      if i != len(audioSegs) - 1:
	        overlayed = audioSegs[i].overlay(audioSegs[i + 1])
	        audioSegs[i + 1] = overlayed
	    allColumns.append(audioSegs[len(audioSegs) - 1])

`comments/` (GET | POST)  
This route provides a way to GET a list of all the user comments and the ability to POST new ones to the database.

`notes/<int:pk>/` & `songs/<int:pk>/` & `users/<int:pk>/` (GET)    
All these routes GET the data related to the note / song / user with the specific id provided at the end of the route.

Additionally, `notes/<int:pk>/` & `songs/<int:pk>/` have a DELETE request which allows a note or song to be removed from the database.