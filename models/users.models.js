
'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  password:String,
  created: {
    type:Date,
    default: Date.now()
  },
  email: String,
  avatar: {
    type:String
  },
  handle: {
    type:String,
    unique:true
  }
});

UserSchema.set('toObject', {
  transform: function (doc, ret) {
    ret.id = ret._id,
    delete ret._id,
    delete ret.__v;
  }
});

module.exports = mongoose.model('User', UserSchema);