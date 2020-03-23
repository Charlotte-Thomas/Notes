
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
  const [noteIds, setNoteIds] = useState([])

  const initialErrorState = { 'title': '', 'notes': '' }

  const [errors, setError] = useState({
    'title': '',
    'notes': ''
  })

  useEffect(() => {
    fetch('/api/notes/')
      .then(resp => resp.json())
      .then(resp => {
        setNotes(resp)
      })
      .then(() => {
        setButtons(document.querySelectorAll('.noteButton'))
        createSubSecs()
      })
    return () => console.log('Unmounting component')
  }, [])

  function playNote(id) {
    const audio = document.getElementsByClassName('noteAudio')[id]
    // console.log(audio)
    audio.play()
  }

  const colors = ['#d66464', '#da965c', '#e4d37d', 'green', 'yellow']

  buttons.forEach((note, i) => {
    note.style.background = colors[i]
    note.addEventListener('click', () => {
      if (block) {
        block[0].style.background = colors[i]
        block[0].style.opacity = '1'
        block[0].innerHTML = note.innerHTML
        block[0].firstChild.src = note.attributes[1].value
        updateGrid()
      }
    })
  })


  function makeBlockChanges(el) {
    setError(initialErrorState)
    console.log(errors.notes)
    el.innerHTML = 'choose sound from selection'
    el.style.opacity = '0.5'
    block.splice(0, block.length)
    block.push(el)
  }

  function playSong() {
    // getValues('play')
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        grid.forEach((row) => {
          row[i].children[1] ? row[i].children[1].play() : console.log('no')
          // console.log(row[i].children[1])
        })
      }, i * 1000)
    }

  }

  function getValues(play) {
    songList.splice(0, songList.length)
    times.splice(0, times.length)
    noteIds.splice(0, noteIds.length)
    const notesToPlay = document.querySelectorAll('.subSec')
    notesToPlay.forEach((n) => {
      songList.push(n.children[1])
    })
    songList.forEach((tune, i) => {
      setTimeout(() => {
        tune && play === 'play' ? tune.play() : console.log('hi')
      }, i * 1000)
      tune && play === 'save' ? times.push(i) + getIds(tune.attributes[1].value) : console.log('hi')
    })
  }

  function handleInput(e) {
    errors.title = ''
    updateForm(e.target.value)
  }

  function getIds(tune) {
    console.log(tune)
    notes.forEach((obj) => {
      if (obj.sound_file === tune) {
        console.log('match')
        noteIds.push(obj.id)
      }
    })
    console.log(noteIds)
  }


  function saveSong() {
    getValues('save')
    axios.post('/api/songs/', { 'title': form, 'times': times, 'notes': noteIds }, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .then((resp) => console.log(resp.response.data))
      .catch((err) => {
        console.log(err.response.data)
        setError({
          'title': err.response.data.title ? err.response.data.title[0] : '',
          'notes': err.response.data.notes ? 'add some notes first!' : ''
        })
      })
  }

  const grid = []

  function createSubSecs() {
    const rows = document.querySelectorAll('.row')
    rows.forEach((row) => {
      const rowx = []
      for (let x = 0; x < 6; x++) {
        const node = document.createElement('div')
        const audio = document.createElement('audio')
        node.classList.add('subSec')
        node.appendChild(audio)
        row.appendChild(node)
        rowx.push(node)
      }
      grid.push(rowx)
    })
    console.log(grid)
    addClickEvents()
  }

  function addClickEvents() {
    grid.forEach((row) => {
      row.forEach((cell) => {
        cell.addEventListener('click', () => {
          makeBlockChanges(cell)
        })
      })
    })
  }

  function updateGrid() {
    grid.splice(0, grid.length)
    const rows = document.querySelectorAll('.row')
    rows.forEach((row) => {
      const rowx = []
      for (let x = 0; x < 6; x++) {
        rowx.push(row.children[x])
      }
      grid.push(rowx)
    })
    // console.log(grid)
  }



  return (
    <div className='createPage centerCol'>
      <h1> Music Creator</h1>
      <div className='centerCol'>
        <h2>Name of song:</h2>
        <input onChange={(e) => handleInput(e)} placeholder='enter a song title'></input>
        <p className='error'>{errors.title}</p>
      </div>
      <h3>Sound Selection</h3>
      <div className='noteButtons centerRow'>{notes.map((n, id) => {
        return <div className='noteButton centerRow' key={id} src={n.sound_file} onClick={() => playNote(id)}><p>{n.note}</p><audio className='noteAudio' src={n.sound_file}></audio></div>
      })}</div>

      <button onClick={() => playSong()}>Play Song</button>

      <section className='player'>
        <div className='row centerRow' id='row0'>
          {/* <div className='subSec' onClick={() => makeBlockChanges(0)}><audio></audio></div>
          <div className='subSec' onClick={() => makeBlockChanges(1)}><audio></audio></div>
          <div className='subSec' onClick={() => makeBlockChanges(2)}><audio></audio></div>
          <div className='subSec' onClick={() => makeBlockChanges(3)}><audio></audio></div>
          <div className='subSec' onClick={() => makeBlockChanges(4)}><audio></audio></div>
          <div className='subSec' onClick={() => makeBlockChanges(5)}><audio></audio></div>
          <div className='subSec' onClick={() => makeBlockChanges(6)}><audio></audio></div> */}
        </div>
        <div className='row centerRow' id='row1'>
        </div>
        <div className='row centerRow' id='row2'>
        </div>
      </section>
      {/* <div>{block === null ? block : console.log('subsec', block)}</div> */}
      <p className='error'>{errors.notes}</p>
      <button onClick={() => saveSong()}>Save Song</button>
    </div>
  )
}

export default Create