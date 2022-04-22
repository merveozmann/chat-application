import React from 'react'
import "./welcome.css";
import Logout from '../logout/Logout';

const Welcome = ({ currentUser }) => {
  return (
    <div className='welcome__container'>
      <Logout />

      <h1>
        Welcome, <span>{currentUser.username}</span>
      </h1>
      <h3>Please select a chat to start message</h3>

    </div>
  )
}

export default Welcome