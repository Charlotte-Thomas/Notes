import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Auth from '../lib/auth'
const moment = require('moment')


const Comments = (props) => {

  const [comments, setComments] = useState([])
  const [names, setNames] = useState([])
  const [error, setError] = useState()

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
  }, [0])


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
      <div>
        <h3>{names[id]}</h3>
        <p>{comment.text}</p>
        <div>{configTime(comment.time_stamp)}</div>
      </div>
    )
  }

  function configTime(time) {
    if (time) {
      console.log(time)
      const split1 = (time).split('.')
      split1.pop()
      const split2 = split1.join('').split('T')
      const split3 = split2[1].split(':')
      split3.pop()
      split2.pop()
      const split4 = split3.join(':')
      split2.push(split4)
      console.log(split2)
      return (
        <div>
          <p>{split2[0]}</p>
          <p>{split2[1]}</p>
        </div>
      )
    }
  }

  configTime()


  return (
    <div className="commentSection">
      <div className="songDiv centerRow width"> {comments.map((comment, id) => {
        return <div className="card centerCol" key={id}>
          {mapComments(comment, id)}
        </div>
      })}
      </div>
      <input></input>
    </div>
  )

}

export default Comments