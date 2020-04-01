import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './CSS/main.scss'


import Login from './components/Login'
import Register from './components/Register'
import Create from './components/Create'
import NavBar from './components/NavBar'
import Gallery from './components/Gallery'
import Edit from './components/Edit'

const App = () => (

  <BrowserRouter>
    <Route url={window.location.href} component={NavBar} />
    <Switch>
      <Route exact path='/' component={Login} />
      <Route exact path='/register' component={Register} />
      <Route exact path='/create' component={Create} />
      <Route exact path='/edit/:id' component={Edit} />
      <Route exact path='/gallery' component={Gallery} />
    </Switch>
  </BrowserRouter>
)


ReactDOM.render(
  <App />,
  document.getElementById('root')
)

