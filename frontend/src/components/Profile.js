
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
        setData(resp)
      })
    setTimeout(() => {
      addSweep()
    }, 200)
    return () => console.log('Unmounting component')
  }, [0])


  function findSongs(song, id) {
    if (song.user === Auth.getUserId()) {
      // console.log(song.title.split('_').join(' '))
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

  function addSweep() {
    const sweep = document.querySelector('.sweep')
    sweep ? sweep.classList.add('slideActive') : null
  }





  return (
    <div className="profile centerCol">
      <h1>Your Discography<span className='sweep slideBefore'></span></h1>
      {/* <h1 className="profileHeader">Your Discography<span className=''>sss</span></h1> */}
      <div className="songDiv centerRow width"> {data.map((song, id) => {
        return <div className="profileCard centerCol" key={id}>
          {findSongs(song, id)}
        </div>
      })}
      </div>
    </div>
  )

}

export default Profile