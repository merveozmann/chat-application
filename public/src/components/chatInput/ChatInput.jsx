import React, { useState } from 'react'
import "./chatInput.css"

const ChatInput = ({handleSendMsg,handleKeyPress}) => {

    const[msg,setMsg]=useState("");
    const sendChat = (event)=>{
        event.preventDefault();
        if(msg.length>0){
            handleSendMsg(msg);
            setMsg("");
        }
    }
    const keypres=(e)=>{
       
        handleKeyPress(e)
    }

    return (
        <div className='chatInput__container'>
            <form className='input__container' onSubmit={(e)=>sendChat(e)} >
                <input type="text" placeholder='type your message here' value={msg} onChange={(e)=>setMsg(e.target.value)} onKeyUp={(e)=>keypres(e)} />
                <button className='submit' >
                    Send
                </button>
            </form>
        </div>
    )
}

export default ChatInput