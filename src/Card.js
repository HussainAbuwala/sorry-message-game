import React, { useState } from 'react'
import './Card.css'
import profilePic from './author.png'
import scrollDown from './scrollDown.gif'

export default function Card({msg, fRef, handleClick}) {

  return (
    <div className='card' ref={fRef}>
        <h2 className='card-header'>{msg}</h2>
        <div className='author-container'>
            <button className='card-btn' onClick={() => handleClick()}>Forgive</button>
            <img className='author-pic'alt='author' src={profilePic}></img>
            <span className='author-name'><i>Hussain Abuwala</i></span>
        </div>
    </div>
  )
}
