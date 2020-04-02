
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Auth from '../lib/auth'
import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import AudioPlayer from 'material-ui-audio-player'

const muiTheme = createMuiTheme({})

const Profile = (props) => {

  const [data, setData] = useState([])
  const [answer, setAnswer] = useState([])

  useEffect(() => {
    fetch('/api/songs/')
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp)
        setData(resp)
      })
    return () => console.log('Unmounting component')
  }, [0])

  function checkAnswer(img) {
    let giveAnswer = 'none'
    answer.forEach((ans) => {
      if (img.correct_answer === ans.id) {
        // console.log(ans.correct_answer)
        giveAnswer = ans.correct_answer
      }
    })
    return giveAnswer
  }

  function findSongs(song, id) {
    if (song.user === Auth.getUserId()) {
      console.log(song.title)
      return <div className="centerCol width">
        <div className="centerCol width">
          <h2 className="songTitle">{song.title}</h2>
          <ThemeProvider theme={muiTheme}>
            <AudioPlayer src={song.song_file} />
          </ThemeProvider>
        </div>
        <br />
        <div>
          <Link to={`/edit/${song.id}`}><button>Edit Song</button></Link>
          <Link to={`/edit/${song.id}`}><button>See Comments</button></Link>
        </div>
        <br />
      </div>
    }
  }


  return (
    <div className="profile centerCol">
      <h1 className="profileHeader">Your Discography</h1>
      <div className="songDiv centerRow width"> {data.map((song, id) => {
        return <div className="card centerCol" key={id}>
          {findSongs(song, id)}
        </div>
      })}
      </div>
    </div>
  )

}

export default Profile