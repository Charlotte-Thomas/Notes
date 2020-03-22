
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Auth from '../lib/auth'


const Create = (props) => {

  const [notes, setNotes] = useState([])
  const [block, setBlock] = useState([])
  const [buttons, setButtons] = useState([])
  const [songList, setSong] = useState([])
  const [form, updateForm] = useState()
  const [times, setTimes] = useState([])

  useEffect(() => {
    fetch('/api/notes/')
      .then(resp => resp.json())
      .then(resp => {
        setNotes(resp)
      })
      .then(() => {
        setButtons(document.querySelectorAll('.noteButton'))
      })
    return () => console.log('Unmounting component')
  }, [])

  function playNote(id) {
    const audio = document.getElementsByClassName('noteAudio')[id]
    // console.log(audio)
    audio.play()
  }

  const colors = ['blue', 'pink', 'red', 'green', 'yellow']

  buttons.forEach((note, i) => {
    note.style.background = colors[i]
    note.addEventListener('click', () => {
      if (block) {
        block[0].style.background = colors[i]
        block[0].style.opacity = '1'
        block[0].innerHTML = note.innerHTML
        block[0].firstChild.src = note.attributes[1].value
      }
    })
  })



  function makeBlockChanges(id) {
    const el = (document.getElementsByClassName('subSec')[id])
    el.innerHTML = 'choose sound from selection'
    el.style.opacity = '0.5'
    block.splice(0, block.length)
    block.push(el)
  }

  function playSong() {
    songList.splice(0, songList.length)
    times.splice(0, times.length)
    const notesToPlay = document.querySelectorAll('.subSec')
    console.log(notesToPlay)
    notesToPlay.forEach((n) => {
      songList.push(n.children[1])
    })
    console.log(songList)
    songList.forEach((tune, i) => {
      setTimeout(() => {
        tune ? tune.play() + times.push(i) : console.log('hi')
      }, i * 1000)
    })
  }

  function handleInput(e) {
    updateForm(e.target.value)
  }

  function saveSong() {
    axios.post('/api/useranswers/', { 'title': form, 'times': times, 'notes': notes }, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
  }


  return (
    <div className='createPage centerCol'>
      <h1> Music Creator</h1>
      <div className='centerCol'>
        <h2>Name of song:</h2>
        <input onChange={(e) => handleInput(e)}></input>
      </div>
      <h3>Sound Selection</h3>
      <div className='noteButtons centerRow'>{notes.map((n, id) => {
        return <div className='noteButton centerRow' key={id} src={n.sound_file} onClick={() => playNote(id)}><p>{n.note}</p><audio className='noteAudio' src={n.sound_file}></audio></div>
      })}</div>

      <button onClick={() => playSong()}>Play Song</button>

      <section className='player'>
        <div className='row centerRow'>
          <div className='subSec' onClick={() => makeBlockChanges(0)}><audio></audio></div>
          <div className='subSec' onClick={() => makeBlockChanges(1)}><audio></audio></div>
          <div className='subSec' onClick={() => makeBlockChanges(2)}><audio></audio></div>
          <div className='subSec' onClick={() => makeBlockChanges(3)}><audio></audio></div>
        </div>
      </section>
      {/* <div>{block === null ? block : console.log('subsec', block)}</div> */}

    </div>
  )
}

export default Create