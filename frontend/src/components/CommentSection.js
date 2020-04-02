import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Auth from '../lib/auth'
const moment = require('moment')


const commentInitialState = {
  text: ''
}

const errorInitialState = {
  errors: ''
}

const Comments = ({ data, updateComments }) => {

  const [comment, setComment] = useState(commentInitialState)


  const [error, setError] = useState(errorInitialState)

  function handleInput(e) {
    setComment({ ...comment, text: e.target.value })
    console.log(comment)
    setError({ ...error, errors: '' })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!comment) return
    axios.post(`/api/spots/${data._id}/comments`, comment, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(resp => updateComments(resp))
      .then(() => setComment({ ...comment, text: '' }))
      .catch((err) => setError({ errors: err.response.data }))
  }

  function handleDelete(e) {
    axios.delete(`/api/spots/${data._id}/comments/${e.target.value}`, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then(resp => updateComments(resp))
      .catch((err) => setError({ errors: err.response.data }))
  }

  function isOwner(elem) {
    return Auth.getUserId() === elem.user.userId
  }

  function formatTimestamp(time) {
    if (!time) return
    const newString = time.substring(0, time.indexOf('.'))
    const newTime = moment(newString).format('LT LL')
    return newTime
  }

  if (!data.comments || data.comments.length === 0) {
    return <article className="media">
      <div className="media-content">
        <div className="content">
          <form className='form' onSubmit={e => handleSubmit(e)}>
            <div className='field'>
              <label className='label'>Post a Comment</label>
              <input
                onChange={e => handleInput(e)}
                type="text"
                className="input"
                value={comment.text}
              />
            </div>
            <button className="button is-info">Post</button>
          </form>
        </div>
      </div>
    </article>
  }


  return (
    <div>
      <div>
        {data.comments.map((elem, i) => {
          return (
            <article className="media" key={i}>
              <div className="media-content">
                <div className="content">
                  <p>
                    <strong>{elem.user.username}</strong>  <small>{formatTimestamp(elem.createdAt)}</small>
                    <br />
                    {elem.text}
                  </p>
                </div>
              </div>
              {isOwner(elem) &&
                <div className="media-right">
                  <button value={elem._id} onClick={(e) => handleDelete(e)} className="delete"></button>
                </div>
              }
            </article>
          )
        })}
      </div>
      <br />
      <article className="media">
        <div className="media-content">
          <div className="content">
            <form className='form' onSubmit={e => handleSubmit(e)}>
              <div className='field'>
                <label className='label'>Post a Comment</label>
                <input
                  onChange={e => handleInput(e)}
                  type="text"
                  className="input"
                  value={comment.text}
                />
              </div>
              <button className="button is-info ">Post</button>
            </form>
          </div>
        </div>
      </article>
    </div>

  )
}

export default Comments