
import React, { useState, useEffect } from 'react'
import axios from 'axios'


const Create = (props) => {

  const [notes, setNotes] = useState([])

  useEffect(() => {
    fetch('/api/notes/')
      .then(resp => resp.json())
      .then(resp => {
        setNotes(resp)
      })
    return () => console.log('Unmounting component')
  }, [])

  function playNote(id) {
    const audio = document.getElementsByClassName('noteAudio')[id]
    // console.log(audio)
    audio.play()
  }

  return (
    <div className='createPage centerCol'>
      <h1> Music Creator</h1>
      <h3>Sound Selection</h3>
      <div className='noteButtons centerRow'>{notes.map((n, id) => {
        return <div className='noteButton centerRow' key={id} src={n.sound_file} onClick={() => playNote(id)}><p>{n.note}</p><audio className='noteAudio' src={n.sound_file}></audio></div>
      })}</div>

      <section className='player'>
        <div className='row centerRow'><div className='subSec'></div><div className='subSec'></div><div className='subSec'></div></div>
      </section>

    </div>
  )
}

export default Create