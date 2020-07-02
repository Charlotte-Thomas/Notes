
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Auth from '../lib/auth'
import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import AudioPlayer from 'material-ui-audio-player'

const muiTheme = createMuiTheme({})


const Gallery = (props) => {

  const [data, setData] = useState([])
  const [artists, setArtists] = useState([])

  useEffect(() => {
    fetch('/api/songs/')
      .then(resp => resp.json())
      .then(resp => {
        setData(resp)
        getArtist(resp)
      })
    setTimeout(() => {
      addSweep()
    }, 200)
    return () => console.log('Unmounting component')
  }, [2])

  function getArtist(songs) {
    const array = []
    songs.forEach((song, i) => {
      fetch(`/api/users/${song.user}`)
        .then(resp => resp.json())
        .then((resp) => {
          array.push(resp.username)
          if (i === songs.length - 1) {
            setArtists(array)
          }
        })
    })
  }

  function addSweep() {
    const sweep = document.querySelector('.sweep')
    sweep ? sweep.classList.add('slideActive') : null
  }

  return (
    <div className="galleryPage centerCol">
      <h1 className="galleryTitle createTitle">Music Gallery<span className='sweep slideBefore'></span></h1>
      <div className='centerRow allCards width'> {data.map((song, id) => {
        return <div className='card centerCol' key={id}>
          <h2 className='title'>{song.title.split('_').join(' ')}</h2>
          <h3 className='artist'>Artist: {artists[id]}</h3>
          <Link to={`/details/${song.id}`}>
            <div className='detailButton'>Song Details</div>
          </Link>
          <ThemeProvider theme={muiTheme}>
            <AudioPlayer src={song.song_file} />
          </ThemeProvider>
        </div>
      })}
      </div>
    </div>
  )
}


export default Gallery


//NOTE:
// edited songs that did NOT change the song title: the file played here will not update straight away 
//- takes a little while to realise the audio file has changes - perhaps it stores the audio file in memory in browser?
// if title is changed then a new audio file is made so this page WILL update to that file straight away