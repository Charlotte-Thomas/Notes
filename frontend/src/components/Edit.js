import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Auth from '../lib/auth'
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { withTheme } from '@material-ui/styles'


const useStyles = makeStyles(() => ({
  cell: {
    backgroundColor: '#607d8b',
    opacity: 1,
    '&:hover': {
      opacity: 0.7
    }
  },
  opacity: {
    opacity: 0.5
  },
  playing: {
    opacity: 0.6
  }
}))


const Edit = (props) => {


  const [data, setData] = useState([])
  const [songName, setName] = useState('')
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
  const [text, setText] = useState('Delete')

  const initialErrorState = { 'title': '', 'notes': '' }

  const [errors, setError] = useState({
    'title': '',
    'notes': ''
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    fetch('/api/notes/')
      .then(resp => resp.json())
      .then(resp => {
        setNotes(resp)
        return resp
      })
      .then((resp) => {
        setButtons(document.querySelectorAll('.noteButton'))
        createSubSecs()
        return resp
      })
      .then((data) => {
        fetch(`/api/songs/${props.match.params.id}`)
          .then(resp => resp.json())
          .then(resp => {
            // console.log(Math.ceil(resp.notes.length / 10))
            const sectionNUm = Math.ceil(resp.notes.length / 10)
            setName(resp.title)
            updateForm(resp.title)
            setData(resp)
            for (let i = 1; i < sectionNUm; i++) {
              addNewSection()
            }
            placeNotes(resp.notes, data)
          })
      })
    setTimeout(() => {
      addSweep()
    }, 200)
    return () => console.log('Unmounting component')
  }, [0])


  function placeNotes(data, Allnotes) {
    Allnotes.forEach((note, i) => {
      data.forEach((noteArray, x) => {
        noteArray.forEach((noteId, y) => {
          if (noteId === note.id) {
            //have to create a p element because when selecting notes changing the innerHTML adds one anyway
            const p = document.createElement('p')
            grid[y][x].insertBefore(p, grid[y][x].childNodes[0])
            grid[y][x].style.background = colors[i + 1]
            grid[y][x].classList.remove(classes.cell)
            grid[y][x].children[1].src = note.sound_file
            grid[y][x].firstChild.innerHTML = note.note
            // console.log('firstchild', grid[y][x].children)
          }
        })
      })
    })
    updateGrid()
    // console.log('GRID AFTER', grid)
  }


  // ----------------------------------------------

  function playNote(id) {
    const audio = document.getElementsByClassName('noteAudio')[id]
    audio.play()
  }

  const colors = ['grey', '#d66464', '#da965c', 'rgb(240, 225, 145)', 'rgb(133, 209, 180)', 'rgb(138, 245, 218)', 'rgb(138, 220, 245)']

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
            // b.classList.add(classes.colors)
            b.classList.remove(classes.cell)
            b.innerHTML = note.innerHTML
            b.firstChild.src = note.attributes[1].value
            // b.children[1].classList.remove('noteAudio')
            b.children[1].removeAttribute('class')
            // console.log(b.children[1].attributes)
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
    // console.log('playgrdi', rowWidth)
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
          ids.push(getIds(audio.attributes[0].value))
        } else {
          ids.push(0)
        }
      })
      noteIds.push(ids)
    }
  }

  function handleInput(e) {
    setName(e.target.value)
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
    axios.post('/api/songs/', { 'title': form ? form.split(' ').join('_') : '', 'times': times, 'notes': noteIds, 'song_file': 'none' }, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      // .then((resp) => console.log(resp.response.data))
      .catch((err) => {
        setError({
          'title': err.response.data.title ? err.response.data.title[0] : '',
          'notes': err.response.data.notes ? 'add some notes first!' : ''
        })
      })
  }

  function updateSong() {
    getValues()
    // console.log({ 'title': form ? form.split(' ').join('_') : '', 'times': times, 'notes': noteIds })
    axios.put(`/api/songs/${props.match.params.id}/`, { 'title': form ? form.split(' ').join('_') : '', 'times': times, 'notes': noteIds }, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      // .then((resp) => console.log(resp.data))
      .catch((err) => {
        console.log(err)
        setError({
          'title': err.response.data.title ? err.response.data.title[0] : '',
          'notes': err.response.data.notes ? 'add some notes first!' : ''
        })
      })
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

  function makeSure(text) {
    if (text === 'Are you sure') {
      deleteSong()
    }
    setText('Are you sure')
  }

  function deleteSong() {
    axios.delete(`/api/songs/${props.match.params.id}/`, {
      headers: { Authorization: `Bearer ${Auth.getToken()}` }
    })
      .catch((err) => {
        setError({
          'notes': err.response.data ? 'unauthorised!' : ''
        })
      })
      .then(() => props.history.push('/profile'))
  }

  function addSweep() {
    const sweep = document.querySelector('.sweep')
    sweep ? sweep.classList.add('slideActive') : null
  }


  return (
    <div className='createPage centerCol'>
      <h1 className='createTitle'> Song Editor<span className='sweep slideBefore'></span></h1>
      <div className='songInput centerCol'>
        <input onChange={(e) => handleInput(e)} value={songName.split('_').join(' ')} placeholder='Enter a song title'></input>
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
        <button className='playButton' onClick={() => playSong()}>{'>'}</button>
        <section className='player'>
          <div className='row centerRow' id='row0'></div>
          <div className='row centerRow' id='row1'></div>
          <div className='row centerRow' id='row2'></div>
        </section>
      </div>
      <button className='addRowsButton' onClick={() => addNewSection()}>+</button>

      <p className='error'>{errors.notes}</p>
      {Auth.getUserId() === data.user && <div className='EditButtons centerRow width'>
        <button className='editButton' onClick={() => saveSong()}>Save as new song</button>
        <button className='editButton' onClick={() => updateSong()}>Update</button>
        <button className='editButton' onClick={() => makeSure(text)}>{text}</button>
      </div>}
    </div>
  )
}

export default Edit


// different to create page:
// removed class attribute from each song element so that line 175 gets the audio src not a 'class'