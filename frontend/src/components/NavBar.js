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
import pallet from '@material-ui/core/colors/blueGrey'

import Auth from '../lib/auth'
import { withTheme } from '@material-ui/styles'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: pallet[900]
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    '&:hover': {
      opacity: 0.8
    }
  },
  border: {
    borderRight: '1px solid white',
    borderRadius: '0%',
    paddingRight: '1.5%',
    marginRight: '0.9%'
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
    <AppBar position="static" className={classes.root}>
      <Toolbar className='navBar'>
        {authorized &&
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="home">
            <Link to='/home'>
              <HomeIcon className={classes.link} />
            </Link>
          </IconButton>}
        <Typography variant="h6" className={classes.title}>
          Notes
        </Typography>
        {authorized &&
          <Button color="inherit" className={classes.link}>
            <Link className={classes.link} to='/create'>
              Create
            </Link>
          </Button>}
        {authorized &&
          <Button color="inherit" className={classes.link}>
            <Link className={classes.link} to='/gallery'>
              Song Gallery
            </Link>
          </Button>}
        {authorized &&
          <Button color="inherit" className={classes.link, classes.border}>
            <Link className={classes.link} to='/profile'>
              {/* <FaceIcon /> */}
              Profile
            </Link>
          </Button>}
        {!authorized && <Button><Link to="/" className={classes.link}>Login</Link></Button>}
        {!authorized && <Button><Link to="/register" className={classes.link}>Register</Link></Button>}
        {/* {Auth.isAuthorized() && */}
        {authorized && <Button><Link to="/" className={classes.link} onClick={() => handleLogout()}>Log Out</Link></Button>}
        {/* } */}
      </Toolbar>
    </AppBar>
  )
}

export default ButtonAppBar