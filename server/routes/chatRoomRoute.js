const { getChatRoom, addRoomMessage, getAllRoomMessages} = require("../controller/chatRoomController");

const router = require("express").Router();

router.get("/getChatRoom",getChatRoom);
router.post("/addRoomMessage",addRoomMessage);
router.post("/getRoomMessages",getAllRoomMessages)


module.exports=router;