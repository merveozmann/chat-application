import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { io } from "socket.io-client"
import { useNavigate } from 'react-router-dom';
import { allUsersRoute, host, getChatRoom } from '../../utils/APIRoutes';
import Contact from '../../components/contact/Contact';
import Welcome from '../../components/welcome/Welcome';
import ChatContainer from '../../components/chatContainer/ChatContainer';
import ChatRoomContainer from "../../components/chatRoomContainer/ChatRoomContainer"
import "./chat.css";

const Chat = () => {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [roomList, setRoomList] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentRoom, setCurrentRoom] = useState(undefined);

  const [isLoaded, setIsLoaded] = useState(false);
  const [onlineUser, setOnline] = useState([]);
  const [roomControl, setRoomControl] = useState(false);

  useEffect(async () => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login")
    } else {
      setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")))
      setIsLoaded(true)
    }
  }, [])
  useEffect(async () => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
      socket.current.on("get-users", async (users) => {
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data)
        setOnline(users)

      })
    }
  }, [currentUser])

  useEffect(async () => {
    if (currentUser) {
      const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
      setContacts(data.data)
      const data1 = await axios.get(`${getChatRoom}`);
      setRoomList(data1.data.rooms)
    }

  }, [currentUser])

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setRoomControl(true)
  }
  const handleRoomChange = (room) => {

    setCurrentChat(true)
    setCurrentRoom(room)
    setRoomControl(false)
  }

  //responseive yap, son görülme ekle, mesajlara zaman eklebilir, chat odasında kimler var gösterilebilir
  return (
    <div className='chat'>
      <div className="container">
        <Contact contacts={contacts} currentUser={currentUser} onlineUser={onlineUser} changeChat={handleChatChange} roomList={roomList} rommChange={handleRoomChange} />
        {
          isLoaded && currentChat === undefined ?
            (<Welcome currentUser={currentUser} />) :
            (roomControl == true ? <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} /> : <ChatRoomContainer currentRoom={currentRoom} currentUser={currentUser} socket={socket} />)
        }
      </div>
    </div>
  )
}
export default Chat