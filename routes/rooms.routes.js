'use strict';

const express = require('express');
const router = express.Router();
const Room = require('../models/rooms.models');



// GET ALL ROOMS User is a part of: 
router.get('/rooms',(req,res,next) => {
  Room.find({'members':req.user.id})
    .then(rooms => {
      res.json(rooms);
    })
    .catch(err => {
      next(err);
    });
});



// GET ROOM BY ID
router.get('/rooms/:urlname', (req,res,next) => {
  const {urlname} = req.params;
  Room.findOne({urlname})
    .then(dbres => {
      if (dbres === [] || dbres === null) {
        const err = new Error();
        err.status = 400;
        err.message = 'Room with this url could not be found';
        return next(err);
      }
      res.json(dbres);
    });
});


// CREATE NEW ROOM
router.post('/rooms', (req,res,next) => {
  const requiredFields = ['urlname', 'title'];
  const newRoom = {};

  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const err = new Error();
      err.message = `Missing ${field} field`;
      err.status = 400;
      return next(err);
    }

    newRoom[field] = req.body[field];
  });


  Room.create(newRoom)
    .then(room => {

      Room.update({'_id':room.id}, {$push: {'members': req.user.id}}, {new:true})
        .then(response => {
          res.json(response);
        });
    })
    .catch(err => {
      next(err);
    });

});


// TODO: Prevent users from creating channels that have the same name as others.

router.put('/rooms/:id', (req,res,next) => {
  const {id} = req.params;
  
  if (req.body.type === 'addChannel') {
    const {channelToAdd, purpose} = req.body;
    const trimmedChannelToRemove = channelToAdd.trim();
    
    if (trimmedChannelToRemove === 'Main') {
      const err = new Error();
      err.status = 400;
      err.message = 'Cannot create a secondary Main Channel.';
      return next(err);
    }

    return Room.findByIdAndUpdate(id, {$push: {'channels': {'title':trimmedChannelToRemove, purpose}}}, {new:true})
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


