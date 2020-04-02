import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Auth from '../lib/auth'
const moment = require('moment')


const Comments = (props) => {

  const errorInitialState = {
    errors: ''
  }

  const [comments, setComments] = useState([])
  const [names, setNames] = useState([])
  const [form, updateForm] = useState()
  const [error, setError] = useState(errorInitialState)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    fetch('/api/comments/')
      .then(resp => resp.json())
      .then(resp => {
        const commentArray = []
        resp.forEach(com => {
          if (com.song === parseFloat(props.props.match.params.id)) {
            commentArray.push(com)
          }
        })
        setComments(commentArray)
        getUsernames(commentArray)
      })
    return () => console.log('Unmounting component')
  }, [reload])


  function getUsernames(com) {
    com.forEach((c) => {
      fetch(`/api/users/${c.user}/`)
        .then(resp => resp.json())
        .then(resp => {
          names.push(resp.username)
        })
        // have to do this in order to force another re-render so usernames update on page
        .then(() => {
          setNames([...names])
        })
    })
  }


  function mapComments(comment, id) {
    // console.log('names', names[0])
    return (
      <div className='width centerCol'>
        <h3>{names[id]}</h3>
        <div className='width centerRow'>{configTime(comment.time_stamp)}</div>
        <p>{comment.text}</p>
      </div>
    )
  }

  function configTime(time) {
    if (time) {
      const split1 = (time).split('.')
      split1.pop()
      const split2 = split1.join('').split('T')
      const split3 = split2[1].split(':')
      split3.pop()
      split2.pop()
      const split4 = split3.join(':')
      split2.push(split4)
      return (
        <div className="centerRow width">
          <p>{split2[0]}</p>
          <p>{split2[1]}</p>
        </div>
      )
    }
  }

  function handleInput(e) {
    updateForm(e.target.value)
  }

  function postComment() {
    const song = parseFloat(props.props.match.params.id)
    axios.post('/api/comments/', { 'song': song, 'text': form }, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then((resp) => console.log(resp.data))
      .catch((err) => {
        console.log(err.response.data)
        setError({
          'errors': err.response.data ? err.response.text : ''
        })
      })
      .then(() => {
        setReload(1)
        updateForm('')
      })
  }


  return (
    <div className="commentSection width centerCol">
      <div className="commentDiv centerRow width"> {comments.map((comment, id) => {
        return <div className="centerCol width" key={id}>
          {mapComments(comment, id)}
        </div>
      })}
      </div>
      <input onKeyPress={((e) => e.key === 'Enter' ? postComment() : null)} onChange={(e) => handleInput(e)} value={form ? form : ''} placeholder='Add a comment'></input>
      <p>{error.errors}</p>
    </div>
  )

}

export default Comments