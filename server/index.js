const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const chatRoomRoutes = require("./routes/chatRoomRoute");

const userModel = require("./model/userModel")

const app = express();
const socket = require("socket.io")

require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes)
app.use("/api/messages", messagesRoute)
app.use("/api/room", chatRoomRoutes)



mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("DB SUCCESS")
}).catch((err) => { console.log(err.message) })


const server = app.listen(process.env.PORT, () => {
    console.log("LİSTEN - >" + process.env.PORT)
})

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
})

let users = [];
let roomUsers = []

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

const addRoomUser = ({ socket_id, name, roomId, userId }) => {
    const exist = roomUsers.find(user => user.roomId === roomId && user.userId === userId);
    if (exist) {
        return { error: 'User already exist in this room' }
    }
    const user = { socket_id, name, roomId, userId };
    roomUsers.push(user)
    return { roomUsers }
}
io.on("connection", (socket) => {
    socket.on("add-user", (userId) => {
        userModel.findByIdAndUpdate(userId, { "lastseen": new Date() }, function (err, result) {})
        addUser(userId, socket.id);
        io.emit("get-users", users);
    });

    socket.on("send-msg", (data) => {
        var sendUserSocket = getUser(data.to);
        if (sendUserSocket != undefined) {
            if (sendUserSocket.socketId) {
                socket.to(sendUserSocket.socketId).emit("msg-recieve", data.message)
            }
        }
    })
    socket.on("send-writing", (data) => {
        // userModel.$where({"_id" :data.from }).update({$set : {"lastseen": new Date()}}, {"multi" : true})
        userModel.findByIdAndUpdate(data.from, { "lastseen": new Date() }, function (err, result) {})

        var sendUserSocket = getUser(data.to);
        if (sendUserSocket != undefined) {
            if (sendUserSocket.socketId) {
                socket.to(sendUserSocket.socketId).emit("get-writing", data.userTyping)
            }
        }
    })
    socket.on("disconnect", () => {
        console.log("disconnect")
        removeUser(socket.id);
        io.emit("get-users", users);
    })

    socket.on('join-room', ({ name, roomId, userId }) => {
        const { error, roomUsers } = addRoomUser({
            socket_id: socket.id,
            name,
            roomId,
            userId
        })
        socket.join(roomId);
        if (error) {
            console.log('join error', error)
        } else {
            console.log('join user')
        }
    });
    socket.on("send-msg-room", (data) => {

        socket.to(data.roomId).emit("msg-recieve-room", data)
    })
    socket.on("send-writing-room", (data) => {
        socket.to(data.roomId).emit("get-writing-room", data)

    })
    socket.on('join-leave', (room) => {
        socket.leave(room);

    });

})