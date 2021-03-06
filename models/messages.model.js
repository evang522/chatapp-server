'use strict';
const mongoose = require('mongoose');
const currentMoment = () => {
  return Date.now();
};

const ThreadMessageSchema = new mongoose.Schema({
  body: {
    type:String,
    required:true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  edited: {
    type:Boolean,
    default:false
  },
});


const MessageSchema = new mongoose.Schema({
  body: {
    type:String,
    required:true
  },
  author: {
    type:mongoose.Schema.Types.ObjectId, ref: 'User',
    required:true
  },
  created: {
    type:Date,
    default: currentMoment
  },
  edited: {
    type:Boolean,
    default:false
  },
  thread: {
    type:[ThreadMessageSchema],
    default:[]
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId, ref:'Room.channels'
  }
});


module.exports = mongoose.model('Message', MessageSchema);