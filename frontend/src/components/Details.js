import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Auth from '../lib/auth'
import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import AudioPlayer from 'material-ui-audio-player'

const muiTheme = createMuiTheme({})

const Details = (props) => {

  const [data, setData] = useState([])
  const [title, setTitle] = useState([])
  const [audio, setAudio] = useState([])

  useEffect(() => {
    fetch(`/api/songs/${props.match.params.id}`)
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp)
        setData(resp)
        setTitle(resp.title.split('_').join(' '))
        setAudio(resp.song_file)
      })
    return () => console.log('Unmounting component')
  }, [0])


  return (
    <div className="profile centerCol">
      <h1 className="profileHeader">{title}</h1>
      <div className="width centerCol">
        <ThemeProvider theme={muiTheme}>
          {console.log(data.song_file)}
          <AudioPlayer src={audio} />
        </ThemeProvider>
      </div>
      <br />
      {data.user === Auth.getUserId() && <div>
        <Link to={`/edit/${data.id}`}><button>Edit Song</button></Link>
      </div>}
    </div>
  )

}

export default Details