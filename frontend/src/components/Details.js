import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Auth from '../lib/auth'
import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import AudioPlayer from 'material-ui-audio-player'
import Comments from './Comments'

const muiTheme = createMuiTheme({})

const Details = (props) => {

  const [data, setData] = useState([])
  const [title, setTitle] = useState([])
  const [audio, setAudio] = useState([])
  const [comments, setComment] = useState([])
  const [artist, setArtist] = useState()

  useEffect(() => {
    fetch(`/api/songs/${props.match.params.id}`)
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp)
        setData(resp)
        setTitle(resp.title.split('_').join(' '))
        setAudio(resp.song_file)
        getUser(resp.user)
      })
    return () => console.log('Unmounting component')
  }, [0])


  function getUser(user) {
    fetch(`/api/users/${user}`)
      .then(resp => resp.json())
      .then((resp) => {
        console.log(resp.username)
        setArtist(resp.username)
      })
  }

  function updateComments(comment) {
    comments.push(comment)
  }


  return (
    <div className="detailPage centerCol">
      <div className='centerCol detailTitles'>
        <h1 className="profileHeader">{title}</h1>
        <h2>By {artist}</h2>
      </div>
      <div className="detailPlayer centerCol">
        <ThemeProvider theme={muiTheme}>
          <AudioPlayer src={audio} />
        </ThemeProvider>
      </div>
      <br />
      {data.user === Auth.getUserId() && <div>
        <Link to={`/edit/${data.id}`}><button>Edit Song</button></Link>
      </div>}
      <Comments props={props} data={data} updateComments={resp => updateComments(resp)} />
    </div>

  )

}

export default Details
