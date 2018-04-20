'use strict';
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  password:String,
  created: Date(),
  email: String,
  phone: String,
  rooms: [{type:mongoose.Schema.Types.ObjectId, ref: 'Room'}],
  avatar: {
    type:String
  }
});

module.exports = mongoose.model('rooms', UserSchema);