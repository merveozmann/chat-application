import React, { useState, useEffect, useRef } from 'react'
import { format } from "timeago.js"
import { v4 as uuidv4 } from "uuid"
import axios from "axios"
import Logo from "../../assets/img/logo-small.png";
import Logout from '../logout/Logout';
import ChatInput from '../chatInput/ChatInput';
import { sendMessageRoute, getAllMessagesRoute } from '../../utils/APIRoutes';
import "./chatContainer.css"

const ChatContainer = ({ currentChat, currentUser, socket }) => {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [writting, setWritting] = useState("");
    const scrollRef = useRef();
    var userTyping = false;
    var userTimingTimeout = undefined;

    useEffect(async () => {
        if (currentUser) {
            const response = await axios.post(getAllMessagesRoute, {
                from: currentUser._id,
                to: currentChat._id
            })
            setMessages(response.data.projectedMessages);
        }
    }, [currentChat])
    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (msg) => {
                setArrivalMessage({ fromSelf: false, message: msg, createdAt: Date.now() })
            })
            socket.current.on("get-writing", (data) => {
                setWritting(data)
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
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            message: msg
        })
        socket.current.emit("send-msg", {
            from: currentUser._id,
            to: currentChat._id,
            message: msg
        })
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs)
    }
    const handleKeyPress = async (e) => {
        if (e.which != 13) {
            userTyping = true;
            socket.current.emit("send-writing", {
                from: currentUser._id,
                to: currentChat._id,
                userTyping: true
            })
            clearTimeout(userTimingTimeout);
            userTimingTimeout = setTimeout(() => {
                socket.current.emit("send-writing", {
                    from: currentUser._id,
                    to: currentChat._id,
                    userTyping: false
                })
            }, 1000)
        } else {
            clearTimeout(userTimingTimeout)
        }
    }
    return (
        currentChat &&
        <div className='chatContainer__content'>
            <div className="chat__header">
                <div className="user__details">
                    <div className="avatar">
                        <img src={Logo} alt="" />
                    </div>
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                    <div className="user__type">
                        <p>{writting == true ? "writing.." : ""}</p>
                    </div>
                </div>
                <Logout  />
            </div>
            <div className="chat__messages">
                {
                    messages.map((message) => {
                        return (
                            <div ref={scrollRef} key={uuidv4()}>
                                <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
                                    <div className="message__content">
                                        <p>
                                            {message.message}
                                        </p>
                                        <p className='message__content-date'>{format(message.createdAt)}</p>
                                    </div>
                                </div>

                            </div>
                        )
                    })}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} handleKeyPress={handleKeyPress} />
        </div>


    )
}

export default ChatContainer