const mongoose = require("mongoose");

const roomMessageSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        roomId: {
            type: String,
            required: true
        },
    }, { timestamps: true })

module.exports = mongoose.model("roomMessage", roomMessageSchema);
