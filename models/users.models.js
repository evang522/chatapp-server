const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    password:String,
    created: Date(),
    email: String,
    phone: String,
    rooms: [{type:Schema.Types.ObjectId, ref: 'Room'}]
})

module.exports = mongoose.model('rooms', RoomSchema);