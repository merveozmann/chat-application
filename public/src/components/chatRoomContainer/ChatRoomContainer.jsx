import React, { useState, useEffect, useRef } from 'react'
import Logout from '../logout/Logout';
import ChatInput from '../chatInput/ChatInput';
import { format } from "timeago.js"
import axios from "axios"
import { sendRoomMessageRoute, getAllRoomMessagesRoute } from '../../utils/APIRoutes';
import { v4 as uuidv4 } from "uuid"

const ChatRoomContainer = ({ currentRoom, currentUser, socket }) => {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [writting, setWritting] = useState("");
  const [writtingUserName, setWrittingUserName] = useState("");

  const scrollRef = useRef();
  var typing = false;
  var userTimingTimeout = undefined;

  useEffect(() => {
    if (currentRoom) {
      socket.current.emit("join-room", { name: currentUser.username, roomId: currentRoom, userId: currentUser._id })
    }
  }, [])

  useEffect(async () => {
    if (currentUser) {
      const response = await axios.post(getAllRoomMessagesRoute, {
        roomId: currentRoom
      })
      setMessages(response.data.messages);
    }
  }, [currentRoom])

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve-room", (msg) => {
        setArrivalMessage({ createdAt: Date.now(), message: msg.message, name: msg.name, roomId: msg.roomId })
      })
      socket.current.on("get-writing-room", (data) => {
        if (data.roomId == currentRoom) {
          setWrittingUserName(data.name)
          setWritting(data.userTyping)
        }
      })
    }
  }, [])
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
  }, [arrivalMessage])
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" })
  }, [messages])
  const handleSendMsg = async (msg) => {
    await axios.post(sendRoomMessageRoute, {
      name: currentUser.username,
      userId: currentUser._id,
      roomId: currentRoom,
      message: msg
    })
    socket.current.emit("send-msg-room", {
      name: currentUser.username,
      userId: currentUser._id,
      roomId: currentRoom,
      message: msg
    })
    const msgs = [...messages];
    msgs.push({
      name: currentUser.username,
      userId: currentUser._id,
      roomId: currentRoom,
      message: msg
    });
    setMessages(msgs)
  }
  const handleKeyPress = async (e) => {
    if (e.which != 13) {
      typing = true;
      socket.current.emit("send-writing-room", {
        roomId: currentRoom,
        name: currentUser.username,
        userTyping: true
      })
      clearTimeout(userTimingTimeout);
      userTimingTimeout = setTimeout(() => {
        socket.current.emit("send-writing-room", {
          roomId: currentRoom,
          name: currentUser.username,
          userTyping: false
        })
      }, 1000)
    } else {
      clearTimeout(userTimingTimeout)
    }
  }
  return (
    <div className='chatContainer__content'>
      <div className="chat__header">
        <div className="user__details">
          <div className="username">
            <h3>{currentRoom}</h3>
          </div>
          <div className="user__type ">
            <p>{writting == true ? (writtingUserName + " writing..") : ""}</p>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat__messages">
        {
          messages.map((message) => {
            return (
              <div ref={scrollRef} key={uuidv4()}>
                <div className={`message ${message.userId == currentUser._id ? "sended" : "recieved"}`}>
                  <div className="message__content">
                    <p>
                      ( {message.name} )--{message.message}
                    </p>
                    <p className='message__content-date'>{format(message.createdAt)}</p>
                  </div>
                </div>

              </div>
            )
          })
        }
      </div>
      <ChatInput handleSendMsg={handleSendMsg} handleKeyPress={handleKeyPress} />
    </div>

  )
}

export default ChatRoomContainer