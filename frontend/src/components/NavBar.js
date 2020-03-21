import React from 'react'
import { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import BrushIcon from '@material-ui/icons/Brush'
import ArtTrackIcon from '@material-ui/icons/ArtTrack'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'
import AllInboxIcon from '@material-ui/icons/AllInbox'
import { Link } from 'react-router-dom'
import FaceIcon from '@material-ui/icons/Face'

import Auth from '../lib/auth'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}))


function handleLogout() {
  Auth.logout()
}

function randomAnswer() {
  return Math.floor(Math.random() * 31) + 1
}

const ButtonAppBar = (props) => {

  const classes = useStyles()

  const [authorized, setAuth] = useState(false)

  useEffect(() => {
    if (Auth.isAuthorized()) {
      setAuth(true)
    } else setAuth(false), console.log('no auth')
    return () => console.log('Unmounting component')
  }, [props.match.params])



  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className='navBar'>
          {authorized &&
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="home">
              <Link to='/start'>
                <HomeIcon />
              </Link>
            </IconButton>}
          <Typography variant="h6" className={classes.title}>
            Notes
          </Typography>
          {authorized &&
            <IconButton color="inherit" id="icon">
              {/* <BrushIcon badgeContent={0} color="secondary"> */}
              <Link to={`/draw/${randomAnswer()}`}>
                <BrushIcon />
              </Link>
              <p className="iconText">Create</p>
            </IconButton>}
          {authorized &&
            <IconButton color="inherit">
              {/* <BrushIcon badgeContent={0} color="secondary"> */}
              <Link to='/drawings'>
                <AllInboxIcon />
              </Link>
              <p className="iconText">Song Gallery</p>
            </IconButton>}
          {authorized &&
            <IconButton color="inherit">
              <Link to='/profile'>  
                <FaceIcon />
              </Link>
              <p className="iconText">Profile</p>
            </IconButton>}
          {!authorized && <Button color="inherit"><Link to="/" style={{ textDecoration: 'none' }}>Login</Link></Button>}
          {!authorized && <Button color="inherit"><Link to="/register" style={{ textDecoration: 'none' }}>Register</Link></Button>}
          {/* {Auth.isAuthorized() && */}
          {authorized && <Button color="inherit"><Link to="/" style={{ textDecoration: 'none' }} onClick={() => handleLogout()}>Log Out</Link></Button>}
          {/* } */}
        </Toolbar>
      </AppBar>
    </div>
  )
}

export default ButtonAppBar