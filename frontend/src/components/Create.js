
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Auth from '../lib/auth'
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles'


const useStyles = makeStyles(() => ({
  cell: {
    backgroundColor: 'lightseagreen',
    opacity: 1,
    '&:hover': {
      opacity: 0.7
    }
  },
  opacity: {
    opacity: 0.5
  }
}))

const Create = (props) => {

  const classes = useStyles()

  const [notes, setNotes] = useState([])
  const [block, setBlock] = useState([])
  const [buttons, setButtons] = useState([])
  const [songList, setSong] = useState([])
  const [grid, setGrid] = useState([])

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
    audio.play()
  }

  const colors = ['#d66464', '#da965c', 'rgb(240, 225, 145)', 'rgb(133, 209, 180)', 'rgb(138, 245, 218)', 'rgb(138, 220, 245)']

  buttons.forEach((note, i) => {
    note.style.background = colors[i]
    note.addEventListener('click', () => {
      if (block) {
        block[0].classList.remove(classes.opacity)
        if (note.innerHTML === 'clear') {
          block[0].style.background = ''
          block[0].classList.add(classes.cell)
          block[0].innerHTML = ''
          block[0].firstChild.src = ''
          updateGrid()
        } else {
          block[0].style.background = colors[i]
          block[0].classList.add(classes.colors)
          block[0].classList.remove(classes.cell)
          block[0].innerHTML = note.innerHTML
          block[0].firstChild.src = note.attributes[1].value
          updateGrid()
        }
      }
    })
  })


  function makeBlockChanges(el) {
    setError(initialErrorState)
    console.log(errors.notes)
    el.innerHTML = 'choose sound from selection'
    el.classList.add(classes.opacity)
    // el.style.opacity = '0.5'
    block.splice(0, block.length)
    block.push(el)
  }

  function playSong() {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        grid.forEach((row) => {
          row[i].children[1] ? row[i].children[1].play() : null
        })
      }, i * 1000)
    }
  }


  function getValues() {
    setNoteIds([])
    setTimes([])
    for (let i = 0; i < 6; i++) {
      const ids = []
      grid.forEach((row) => {
        const audio = row[i].children[1]
        if (audio) {
          times.push(i)
          ids.push(getIds(audio.attributes[1].value))
        } else {
          ids.push(0)
        }
      })
      noteIds.push(ids)
    }
    console.log('ids', noteIds)
    console.log('times', times)
  }

  function handleInput(e) {
    errors.title = ''
    updateForm(e.target.value)
  }

  function getIds(tune) {
    let giveId = 0
    console.log(tune)
    notes.forEach((obj) => {
      if (obj.sound_file === tune) {
        console.log('match')
        // noteIds.push(obj.id)
        giveId = obj.id
      }
    })
    return giveId
  }


  function saveSong() {
    getValues()
    console.log({ 'title': form ? form.split(' ').join('_') : '', 'times': times, 'notes': noteIds })
    axios.post('/api/songs/', { 'title': form ? form.split(' ').join('_') : '', 'times': times, 'notes': noteIds, 'song_file': 'none' }, {
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

  // ---------- Grid Creation ------------

  function createSubSecs() {
    const rows = document.querySelectorAll('.row')
    rows.forEach((row) => {
      const rowx = []
      for (let x = 0; x < 6; x++) {
        const node = document.createElement('div')
        const audio = document.createElement('audio')
        node.classList.add('subSec')
        node.classList.add('centerRow')
        node.classList.add(classes.cell)
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
        <input onChange={(e) => handleInput(e)} placeholder='Enter a song title'></input>
        <p className='error'>{errors.title}</p>
      </div>
      <h3>Sound Selection</h3>
      <div className='noteButton centerRow'>clear</div>
      <div className='noteButtons centerRow'>{notes.map((n, id) => {
        return <div className='noteButton centerRow' key={id} src={n.sound_file} onClick={() => playNote(id)}><p>{n.note}</p><audio className='noteAudio' src={n.sound_file}></audio></div>
      })}</div>

      <button onClick={() => playSong()}>Play Song</button>

      <section className='player'>
        <div className='row centerRow' id='row0'></div>
        <div className='row centerRow' id='row1'></div>
        <div className='row centerRow' id='row2'></div>
      </section>
      <p className='error'>{errors.notes}</p>
      <button onClick={() => saveSong()}>Save Song</button>
    </div>
  )
}

export default Create