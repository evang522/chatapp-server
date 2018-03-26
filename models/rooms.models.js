const mongoose = require('mongoose');


const ChannelSchema = new mongoose.Schema({
    title: {
        type:String
    }
})

const RoomSchema = new mongoose.Schema({
    title: String,
    urlname: {
        type: String,
        unique:true
    },
    channels: {
        type: [ChannelSchema]
    }
})

module.exports = mongoose.model('rooms', RoomSchema);