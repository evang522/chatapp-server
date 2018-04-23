'use strict';
//================================== Require Dependencies ====================>
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//================================== Bring in Models ====================>
const Message = require('../models/messages.model.js');
const Room = require('../models/rooms.models');

//================================== GET Route ====================>
router.get('/messages', (req,res,next) => {
  // We require a query which allows us to determine which channel to pull these messages from. No need to specify a room. If you've specified a channel, you've specified a room implicitly. 
  const {channelId} = req.query;

  if (!channelId) {
    const err = new Error();
    err.status = 400;
    err.message = 'Channel ID is required';
    return next(err);
  }

  if (!mongoose.Types.ObjectId.isValid(channelId)) {
    const err = new Error();
    err.status = 400;
    err.message='Invalid Channel ID provided';
    return next(err);
  }

  Message.find({'channel':channelId})
    .then(response => {
      if (!response || !response.length) {
        const err = new Error();
        err.status = 404;
        err.message = 'No messages found';
        return next(err);
      }

      res.json(response);
    });

});

router.post('/messages', (req,res,next) => {
  const {channelId} = req.query;
  const {body,author} = req.body;
  
  if (!channelId) {
    const err = new Error();
    err.status = 400;
    err.message = 'Channel Id is required';
    return next(err);
  }

  if (!body || !author) {
    const err = new Error();
    err.status = 400;
    err.message = 'Missing one of required fields \'body\' or \'author\'.';
    return next(err);
  }

  Room.find({'channels._id':channelId})
    .then(response => {
      if (!response || !response.length) {
        const err = new Error();
        err.status = 400;
        err.message = 'The specified channel was not found';
        return next(err);
      }
    })
    .catch(err => {
      return next(err);
    });

  const newMessage = {
    body,
    author,
    channel:channelId
  };

  Message.create(newMessage)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(err => {
      return next(err);
    });
});


router.put('/messages/:id', (req,res,next) => {
  const {id} = req.params;
  const {body} = req.body;

  if (!id) {
    const err = new Error();
    err.status = 400;
    err.message = 'Message ID parameter required';
    return next(err);
  }

  if (!body) {
    const err = new Error();
    err.status = 400;
    err.message = 'New message body to set required';
    return next(err);
  }

  Message.findByIdAndUpdate(id,{$set: {body, edited:true}}, {new:true})
    .then(response => {
      res.status(200).json(response);
    })
    .catch(err => {
      next(err);
    });
});

router.delete('/messages/:id', (req,res,next) => {
  const {id} = req.params;

  if (!id) {
    const err = new Error();
    err.status = 400;
    err.message = 'Message ID parameter required';
    return next(err);
  }
  
  Message.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);

});




module.exports = router;
