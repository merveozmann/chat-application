const roomMessageModel = require("../model/roomMessage");

module.exports.getChatRoom = async (req, res, next) => { 
    let rooms = ["ChatRoom1","ChatRoom2","ChatRoom3"];
    try {
        res.json({rooms});
        
    } catch (error) {
        next(error)
    }
}
module.exports.addRoomMessage = async (req, res, next) => {
    console.log("messaj kayıt alanı")
    try {
        console.log(req.body)
        const {name,userId,roomId,message}=req.body;
        const data = await roomMessageModel.create({
            name:name,
            userId:userId,
            message:message,
            roomId:roomId
        });
        if(data) return res.json({msg:"Message addedd successfuly"})
        return res.json({msg:"Failed to add message to the database"})

    } catch (error) {
        next(error);
    }
}
module.exports.getAllRoomMessages = async (req, res, next) => { 
    try {
        const {roomId}= req.body;
        const messages = await roomMessageModel.find({
            roomId:roomId
        }).sort({updatedAt:1});
        console.log(messages)
        res.json({messages});
        
    } catch (error) {
        next(error)
    }
}