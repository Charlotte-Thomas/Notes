
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Auth from '../lib/auth'
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { withTheme } from '@material-ui/styles'


const useStyles = makeStyles(() => ({
  cell: {
    // backgroundColor: '#78909c',
    backgroundColor: '#607d8b',
    // backgroundColor: '#90a4ae',
    opacity: 1
  },
  opacity: {
    opacity: 0.5
  },
  border: {
    border: '1px solid #263238'
  },
  playing: {
    opacity: 0.6
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

  const [rowWidth, setWidth] = useState(10)

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
    setTimeout(() => {
      addSweep()
    }, 200)
    return () => console.log('Unmounting component')
  }, [])

  function playNote(id) {
    const audio = document.getElementsByClassName('noteAudio')[id]
    audio.play()
  }

  const colors = ['grey', 'rgb(208, 86, 86)', '#da965c', 'rgb(240, 225, 145)', 'rgb(133, 209, 180)', 'rgb(95, 193, 156)', 'rgb(138, 220, 245)']
  // const colors = ['grey', '#b0bec5', '#90a4ae', '#78909c', '#455a64', 'rgb(65, 83, 93)']

  buttons.forEach((note, i) => {
    note.style.background = colors[i]
    note.addEventListener('click', () => {
      if (block) {
        block.forEach((b) => {
          b.classList.remove(classes.opacity)
          if (note.innerHTML === 'clear') {
            b.style.background = ''
            b.classList.add(classes.cell)
            b.innerHTML = ''
            // b.firstChild.src = '' // this apparently doesn't exist 
            updateGrid()
          } else {
            b.style.background = colors[i]
            // b.classList.add(classes.border)
            b.classList.add(classes.colors)
            b.classList.remove(classes.cell)
            b.innerHTML = note.innerHTML
            b.firstChild.src = note.attributes[1].value
            updateGrid()
          }
        })
      }
      block.splice(0, block.length)
    })
  })


  function makeBlockChanges(el) {
    setError(initialErrorState)
    el.innerHTML = 'choose sound from selection'
    el.classList.add(classes.opacity)
    // el.style.opacity = '0.5'
    // block.splice(0, block.length)
    block.push(el)
  }

  function playSong() {
    for (let i = 0; i < rowWidth; i++) {
      grid.forEach((row) => {
        setTimeout(() => {
          row[i].children[1] ? row[i].children[1].play() : null
          row[i].classList.add(classes.playing)
          setTimeout(() => {
            row[i].classList.remove(classes.playing)
          }, 1000)
        }, i * 1000)
      })
    }
  }


  function getValues() {
    setNoteIds([])
    setTimes([])
    for (let i = 0; i < rowWidth; i++) {
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
  }

  function handleInput(e) {
    errors.title = ''
    updateForm(e.target.value)
  }

  function getIds(tune) {
    let giveId = 0
    notes.forEach((obj) => {
      if (obj.sound_file === tune) {
        // noteIds.push(obj.id)
        giveId = obj.id
      }
    })
    return giveId
  }


  function saveSong() {
    getValues()
    // console.log({ 'title': form ? form.split(' ').join('_') : '', 'times': times, 'notes': noteIds })
    if (times.length === 0) {
      setError({
        'notes': 'add some notes first!'
      })
      return
    }
    axios.post('/api/songs/', { 'title': form ? form.split(' ').join('_') : '', 'times': times, 'notes': noteIds, 'song_file': 'none' }, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .catch((err, resp) => {
        setError({
          'title': err.response.data.title ? err.response.data.title[0] : '',
          'notes': err.response.data.notes ? 'add some notes first!' : ''
        })
        return resp
      })
      .then((resp) => resp ? props.history.push(`/edit/${resp.data.id}`) : null)
  }

  // ---------- Grid Creation ------------

  function createSubSecs(newRows) {
    let newClass = '.row'
    if (newRows) {
      newClass = newRows
    }
    const rows = document.querySelectorAll(newClass)

    rows.forEach((row, index) => {
      const rowx = []
      for (let x = 0; x < 10; x++) {
        const node = document.createElement('div')
        const audio = document.createElement('audio')
        node.classList.add('subSec')
        node.classList.add('centerRow')
        node.classList.add(classes.cell)
        node.appendChild(audio)
        row.appendChild(node)
        rowx.push(node)
        if (newRows) {
          grid[index].push(node)
        }
      }
      if (!newRows) {
        grid.push(rowx)
      }
    })
    // console.log('chuild', rows[0].children.length > 0 ? 'yay' : 'empty')
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
    const sections = document.querySelectorAll('.player')
    for (let y = 0; y < 3; y++) {
      const rowx = []
      sections.forEach((sec) => {
        for (let x = 0; x < 10; x++) {
          rowx.push(sec.children[y].children[x])
        }
      })
      grid.push(rowx)
    }
  }

  function addNewSection() {
    const prevWidth = rowWidth
    const newClass = `newRow${prevWidth}`
    const player = document.querySelector('.playingBlocks')
    const node = document.createElement('section')
    node.classList.add('player')
    for (let i = 0; i < 3; i++) {
      const row = document.createElement('div')
      row.classList.add('row')
      row.classList.add('centerRow')
      row.classList.add('addedRow')
      row.classList.add(newClass)
      node.appendChild(row)
    }
    player.appendChild(node)
    setWidth(rowWidth + 10)
    createSubSecs(`.${newClass}`)

  }

  function addSweep() {
    const sweep = document.querySelector('.sweep')
    sweep ? sweep.classList.add('slideActive') : null
  }




  return (
    <div className='createPage centerCol'>
      <h1 className='createTitle'> Music Creator <span className='sweep slideBefore'></span></h1>
      <div className='songInput centerCol'>
        <input onChange={(e) => handleInput(e)} placeholder='Enter a song title'></input>
      </div>
      <p className='error'>{errors.title}</p>

      <div className="soundSelection centerCol">
        <h2>Sound Selection</h2>
        <div className='noteButton clearButton centerRow'>clear</div>
        <div className='noteButtons centerRow'>{notes.map((n, id) => {
          return <div className='noteButton centerRow' key={id} src={n.sound_file} onClick={() => playNote(id)}><p>{n.note}</p><audio className='noteAudio' src={n.sound_file}></audio></div>
        })}</div>
      </div>

      <div className='playingBlocks centerRow'>
        {/* <div className='playbutton'> */}
        <button className='playButton' onClick={() => playSong()}>{'>'}</button>
        {/* </div> */}
        <section className='player'>
          <div className='row centerRow'></div>
          <div className='row centerRow'></div>
          <div className='row centerRow'></div>
        </section>
      </div>
      <button className='addRowsButton' onClick={() => addNewSection()}>+</button>

      <p className='error'>{errors.notes}</p>
      <button className='saveButton' onClick={() => saveSong()}>Save</button>
    </div>
  )
}

export default Create



// use focus to be setTimeout for play button
// allow artist to make notes?
//load icon
//other songs by that artist in gallery
//search function in gallery by artist and song name
// day song was created
//ratings
//song genres
// create minus button to remove song level



