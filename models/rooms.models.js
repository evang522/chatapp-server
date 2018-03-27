'use strict';

const mongoose = require('mongoose');


const ChannelSchema = new mongoose.Schema({
  title: {
    type:String,
    unique:true
  }
});

const RoomSchema = new mongoose.Schema({
  title: String,
  urlname: {
    type: String,
    unique:true
  },
  channels: {
    type: [ChannelSchema],
  },
  created: {
    type:Date,
    default:Date.now()
  }
});


RoomSchema.pre('save',function(next) {
  if (this.channels.length === 0)
    this.channels.push({'title':'General'});
  next();
});

module.exports = mongoose.model('rooms', RoomSchema);
