
import React, { useState } from 'react'
import axios from 'axios'
import Auth from '../lib/auth'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import pallet from '@material-ui/core/colors/blueGrey'

const initialLoginState = {
  username: '',
  email: '',
  password: ''
}

const errorInitialState = {
  errors: ''
}

const useStyles = makeStyles(theme => ({
  root: {
    height: '100vh'
  },
  image: {
    backgroundImage: 'url(https://i.imgur.com/M9zJaqv.gif?noredirect)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: pallet[800]
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: pallet[800],
    color: pallet[50],
    '&:hover': {
      backgroundColor: pallet[700]
    }
  },
  grid: {
    backgroundColor: pallet[400]
  },
  textField: {
    backgroundColor: '#b0bec3'
  },
  link: {
    color: pallet[800]
  }
}))

const Login = (props) => {

  const classes = useStyles()

  const [form, updateForm] = useState(initialLoginState)
  const [error, setError] = useState(errorInitialState)

  function handleInput(e) {
    updateForm({ ...form, [e.target.name]: e.target.value })
    setError({ ...error, errors: '' })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form) return
    axios.post('/api/login', form)
      .then(resp => {
        Auth.setToken(resp.data.token)
      })
      .then(() => props.history.push('/home'))
      .catch((err) => setError({ errors: 'Email or Password Incorrect' }))
  }


  const theme = createMuiTheme({
    palette: {
      primary: {
        main: '#455a64'
      }
    }
  })


  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square className={classes.grid}>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form, 'loginForm'} onSubmit={(e) => handleSubmit(e)}>
            <ThemeProvider theme={theme}>
              <TextField
                variant="filled"
                className={classes.margin, classes.textField}
                margin="normal"
                required
                fullWidth
                type="text"
                label="username"
                id="username"
                name="username"
                autoComplete="username"
                autoFocus
                onChange={(e) => handleInput(e)}
              />
            </ThemeProvider>
            <ThemeProvider theme={theme}>
              <TextField
                variant="filled"
                className={classes.margin, classes.textField}
                margin="normal"
                required
                fullWidth
                type="text"
                label="Email Address"
                id="email"
                name='email'
                autoComplete="email"
                autoFocus
                onChange={(e) => handleInput(e)}
              />
            </ThemeProvider>
            <ThemeProvider theme={theme}>
              <TextField
                variant="filled"
                className={classes.margin, classes.textField}
                margin="normal"
                required
                fullWidth
                type="password"
                label="Password"
                id="password"
                name="password"
                autoComplete="password"
                autoFocus
                onChange={(e) => handleInput(e)}
              // className={classes.textField}
              />
            </ThemeProvider>
            {error.errors && <small className="help is-danger">{error.errors}</small>}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              // color="secondary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/register" className={classes.link} variant="body2">
                  {'Don\'t have an account? Join here'}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  )
}

export default Login