'use strict';
const mongoose = require('mongoose');

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
    default: Date.now(),
  },
  edited: {
    type:Boolean,
    default:false
  },
  thread: {
    type:[ThreadMessageSchema],
    default:[]
  }
});


module.exports = mongoose.Model('Message', MessageSchema);