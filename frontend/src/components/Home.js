
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'



const Home = (props) => {

  useEffect(() => {
    setTimeout(() => {
      addSweep()
    }, 200)
    return () => console.log('Unmounting component')
  }, [0])

  function addSweep() {
    const sweep = document.querySelector('.sweep')
    sweep ? sweep.classList.add('slideActive') + console.log('yaaa') : null
  }

  return (
    <div className="home">
      <h1>Notes<span className='sweep slideBefore'></span></h1>
    </div>
  )

}

export default Home