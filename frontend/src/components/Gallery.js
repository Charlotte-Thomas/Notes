
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
        console.log(resp)
        getArtist(resp)
      })
    return () => console.log('Unmounting component')
  }, [0])

  function getArtist(songs) {
    const array = []
    songs.forEach((song, i) => {
      fetch(`/api/users/${song.user}`)
        .then(resp => resp.json())
        .then((resp) => {
          console.log(resp.username)
          array.push(resp.username)
          if (i === songs.length - 1) {
            setArtists(array)
            // console.log(artists)
          }
        })
    })
  }

  return (
    <div className="galleryPage">
      <div className='centerCol allCards'> {data.map((song, id) => {
        return <div className='card centerCol' key={id}>
          <h2 className='title'>{song.title}</h2>
          <h3 className='artist'>Artist: {artists[id]}</h3>
          <ThemeProvider theme={muiTheme}>
            <AudioPlayer src={song.song_file} />
          </ThemeProvider>;
        </div>
      })}
      </div>
    </div>
  )
}


export default Gallery