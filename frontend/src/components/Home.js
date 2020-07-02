
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
    sweep ? sweep.classList.add('slideActive') : null
  }

  return (
    <div className="home centerCol">
      <h1>Notes<span className='sweep slideBefore'></span></h1>
      <div className='centerCol info'>
        <h2>Introduction</h2>
        <p>Welcome to Notes! Here you can create and share music all on the same platform.</p>
        <h2>Navigation</h2>
        <ol> 
          <li><b>Create:</b> here you can create your very own music using a selection of sound samples (see below for instructions on how to use the creator)</li>
          <li><b>Song Gallery:</b> here you can see all the music created by users on the platform. You can go on to see details of their songs and let the artist know your thoughts on their creation.</li>
          <li><b>Profile:</b> here you can see your discography of music i.e. all the songs you've made on the platform. from here you can see what users have said about your songs and edit your songs.</li>
        </ol>
        <h2>Creator instructions</h2>
        <ol>
          <li>Start of your music creation by adding a title for your song</li>
          <li>Next use the player below to select one or mutiple blocks</li>
          <li>Once selected click one of the coloured sound bites on the right to place into the block(s) or clear them</li>
          <li>To play your song, click the > button on the left of the player</li>
          <li>Sound blocks in the same column of the player will overlay each other</li>
          <li>The player will play your song from left to right</li>
          <li>To add additonal blocks to your song, click the plus(+) button below the player</li>
          <li>Once you're satisfied with your song or just want to save for now, click the save button. You can always edit it later!</li>
        </ol>

      </div>
    </div>
  )

}

export default Home