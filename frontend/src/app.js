import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './CSS/main.scss'


import Login from './components/Login'
import Register from './components/Register'
import Create from './components/Create'
import NavBar from './components/NavBar'

const App = () => (

  <BrowserRouter>
    <Route url={window.location.href} component={NavBar} />
    <Switch>
      <Route exact path='/' component={Login} />
      <Route exact path='/register' component={Register} />
      <Route exact path='/create' component={Create} />
    </Switch>
  </BrowserRouter>
)


ReactDOM.render(
  <App />,
  document.getElementById('root')
)

