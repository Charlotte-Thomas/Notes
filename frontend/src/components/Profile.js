
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

  useEffect(() => {
    fetch('/api/songs/')
      .then(resp => resp.json())
      .then(resp => {
        console.log(resp)
        setData(resp)
      })
    return () => console.log('Unmounting component')
  }, [0])


  function findSongs(song, id) {
    if (song.user === Auth.getUserId()) {
      console.log(song.title.split('_').join(' '))
      const titleFix = song.title.split('_').join(' ')
      return <div className="centerCol width">
        <div className="centerCol width">
          <h2 className="songTitle">{titleFix}</h2>
          <div className='links centerRow'>
            <Link to={`/edit/${song.id}`}><button>Edit Song</button></Link>
            <Link to={`/details/${song.id}`}><button>More details</button></Link>
          </div>
          <ThemeProvider theme={muiTheme}>
            <AudioPlayer src={song.song_file} />
          </ThemeProvider>
        </div>
      </div>
    }
  }

  function populateNotes(t) {
    // const formData = new FormData()
    const soundfile = new Audio('./musicNotes/after.wav')
    soundfile.play()

    const audio = new Audio('./musicNotes/after.wav')
    audio.load()
    audio.play()
    // console.log(soundfile)
    // console.log(t.target.firstChild.src)
    // t.target.firstChild.play()

    // formData.append('sound_file', soundfile.files[0])
    // axios.post('/api/notes/', data, {
    //   headers: {
    //     'Content-type': 'multipart/form-data',
    //     Authorization: `Bearer ${Auth.getToken()}`
    //   }
    // })
    //   .then(resp => console.log(resp.data))
    //   .then(setHideSubmit(true))
  }


  return (
    <div className="profile centerCol">
      <h1 className="profileHeader">Your Discography</h1>
      <div className="songDiv centerRow width"> {data.map((song, id) => {
        return <div className="profileCard centerCol" key={id}>
          {findSongs(song, id)}
        </div>
      })}
      </div>
      {/* <form encType="multipart/form-data">
        <input type="file" id="file" name="file" value="./musicNotes/after.wav" />
      </form> */}
      {/* <audio src='./musicNotes/B1-g.wav'></audio> */}
      <button onClick={(t) => populateNotes(t)}><audio src='musicNotes/A1-g.wav'/><audio/></button>
    </div>
  )

}

export default Profile