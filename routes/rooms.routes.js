'use strict';

const express = require('express');
const router = express.Router();
const Room = require('../models/rooms.models');



// GET ALL ROOMS
router.get('/rooms', (req,res,next) => [
  Room.find({})
    .then(rooms => {
      res.json(rooms);
    })
    .catch(err => {
      next(err);
    })
]);



// GET ROOM BY ID
router.get('/rooms/:id', (req,res,next) => {
  const {id} = req.params;
  Room.findById(id)
    .then(dbres => {
      if (dbres === []) {
        const err = new Error();
        err.status = 400;
        err.message = 'Room with this ID could not be found';
        return next(err);
      }
      res.json(dbres);
    });
});


// CREATE NEW ROOM

router.post('/rooms', (req,res,next) => {
  const requiredFields = ['urlname'];
  const newRoom = {};

  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const err = new Error();
      err.message = `Missin ${field} field`;
      err.status = 400;
      return next(err);
    }

    newRoom[field] = req.body[field];
  });


  Room.create(newRoom)
    .then(room => {
      res.json(room);
    })
    .catch(err => {
      next(err);
    });

});



router.put('/rooms/:id', (req,res,next) => {
  const {id} = req.params;

  if (req.body.type === 'addChannel') {
    const {channelToAdd} = req.body;
    const trimmedChannelToRemove = channelToAdd.trim();
    
    return Room.findByIdAndUpdate(id, {$push: {'channels': {'title':trimmedChannelToRemove}}}, {new:true})
      .then(room => {
        res.status(200).json(room);
      });
  }

  if (req.body.type === 'removeChannel') {
    const {channelToRemove} = req.body;
    const trimmedChannelToRemove = channelToRemove.trim();

    return Room.findByIdAndUpdate(id, {$pull: {'channels': {'title': trimmedChannelToRemove}}}, {new:true})
      .then(room => {
        res.status(200).json(room);
      })
      .catch(err => {
        next(err);
      });
  }

});


router.delete('/rooms/:id', (req,res,next) => {
  const {id} = req.params;
  Room.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;


