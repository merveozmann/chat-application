import React, { useState, useEffect } from 'react'
import {format} from "timeago.js"
import "./contact.css";
import Logo from "../../assets/img/logo-small.png";

const Contact = ({ contacts, currentUser, onlineUser, changeChat, roomList, rommChange }) => {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [roomChatSelected, setroomChatSelected] = useState(undefined);
  const [userList, setUserList] = useState({});

  useEffect(() => {
    
    var obj = {}
    for (var i = 0; i < contacts.length; i++) {
      var id = contacts[i]._id
      if (!obj[id]) {
        obj[id] = { username: contacts[i].username, connect: false,lastseen:contacts[i].lastseen ,email:contacts[i].email ,_id:contacts[i]._id }
      }
      if (onlineUser.length > 0) {
        for (var j = 0; j < onlineUser.length; j++) {
          if (contacts[i]._id == onlineUser[j].userId) {
            obj[id].connect = true
          }
        }
      }
    }

    setUserList(obj)
    console.log(onlineUser)
    console.log(obj)
  }, [onlineUser])
  useEffect(() => {
    if (currentUser) {
      setCurrentUserName(currentUser.username);
    }
  }, [currentUser])
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index)
    changeChat(contact)
  }
  const changeRoomChat = (index, room) => {
    setroomChatSelected(room)
    rommChange(room)
  }
  return (
    <div className='contact__container'>
      <div className="brand">
        <h5>Chat Room</h5>
      </div>
      <div className="contacts">
        {
          roomList.map((room, index) => {
            return (
              <div className={`contact__chatroom contact__room ${room === roomChatSelected ? "selected__room" : ""}`} onClick={() => changeRoomChat(room, room)} key={index}>
                {room}
              </div>
            )
          })
        }
      </div>

      <div className="brand">
        <h5>Users List</h5>
      </div>
      <div className="contacts">
        {
         Object.keys(userList).map((key, index) => {
            return (
              <div className={` contact ${index === currentSelected ? "selected" : ""}`} onClick={() => changeCurrentChat(index, userList[key])} key={index}>
                <div className="avatar">
                  <img src={Logo} alt="" />
                </div>
                <div className="username">
                  <h3>{userList[key].username}</h3>
                </div>
                <div className="username">
                  <h3>{userList[key].connect == true? "Online" : format(userList[key].lastseen)}</h3>
                </div>

              </div>
            )
          })
        }
      </div>
      <div className="current__user">
        <div className="avatar">
          <img src={Logo} alt="" />
        </div>
        <div className="username">
          <h3>{currentUserName}</h3>
        </div>
      </div>
    </div>
  )
}

export default Contact