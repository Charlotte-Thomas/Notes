import React, { useState } from 'react'
import axios from 'axios'

import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}))

const formInitialState = {
  username: '',
  email: '',
  profilePicture: '',
  password: '',
  password_confirmation: ''
}

const errorInitialState = {
  errors: ''
}

const Register = (props) => {
  const classes = useStyles()

  const [form, updateForm] = useState(formInitialState)
  const [error, setError] = useState(errorInitialState)


  function handleInput(e) {
    updateForm({ ...form, [e.target.name]: e.target.value })
    setError({ ...error, errors: '' })
    console.log(form)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form) return
    axios.post('/api/register', form)
      .then(() => {
        if (error.errors === '') {
          props.history.push('/')
        }
      })
      .catch((err) => setError({ errors: err.response.data }))
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} onSubmit={(e) => handleSubmit(e)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="fname"
                onChange={e => handleInput(e)}
                type='text'
                name='username'
                // variant="outlined"
                required
                fullWidth
                id="Username"
                label="Username"
                autoFocus
              />
            </Grid>
            {error.errors.username && !form.username && <small className="help is-danger">
              {error.errors.username}
            </small>}
            <Grid item xs={12}>
              <TextField
                // variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                onChange={e => handleInput(e)}
                type='text'
                name='email'
                autoComplete="email"
              />
            </Grid>
            {error.errors.email && !form.email && <small className="help is-danger">
              {error.errors.email}
            </small>}
            <Grid item xs={12}>
              <TextField
                // variant="outlined"
                required
                fullWidth
                onChange={e => handleInput(e)}
                type='text'
                name='password'
                label="Password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
            {error.errors.password && !form.password && <small className="help is-danger">
              {error.errors.password}
            </small>}
            <Grid item xs={12}>
              <TextField
                // variant="outlined"
                required
                fullWidth
                onChange={e => handleInput(e)}
                type='text'
                name='password_confirmation'
                label="Password Confirmation"
                id="password_confirmation"
              />
            </Grid>
            {error.errors && form.password_confirmation !== form.password && <small className="help is-danger">
              {error.errors.password_confirmation}
            </small>}
          </Grid>
          <Grid item xs={12}>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div >
      <Box mt={5}>
      </Box>
    </Container >
  )
}

export default Register