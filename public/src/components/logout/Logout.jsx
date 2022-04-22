import React from 'react'
import "./logout.css"
import { useNavigate } from 'react-router-dom'

const Logout = ( ) => {
    const navigate = useNavigate();
    const handleClick = async () => {
        window.location.reload(false);
        localStorage.clear();
        navigate("/login");
    }
    return (
       <button className='logout__button' onClick={handleClick}>
           Logout
       </button>
    )
}

export default Logout