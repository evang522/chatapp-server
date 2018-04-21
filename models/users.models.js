'use strict';
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  password:String,
  created: Date(),
  email: String,
  phone: String,
  avatar: {
    type:String
  },
  handle: {
    type:String
  }
});

module.exports = mongoose.model('rooms', UserSchema);