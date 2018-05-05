'use strict';
//================================== Import Dependencies ====================>
const express = require('express');
const router = express.Router();
const User = require('../models/users.models');
const {JWT_SECRET} = require('../config');
const dayAdder = require('../utils/dayAdder.utils');
const jwt = require('jsonwebtoken');

//================================== Login Route ====================>
router.post('/login', (req,res,next) => {
  // Create an Array of required Fields in Req body which we can loop over for validation.
  const requiredFields = ['identifier','password'];

  let userInfo = {};
  requiredFields.forEach(field => {
    userInfo[field] = req.body[field];
  });


  //Validation
  if (!userInfo.identifier) {
    const err = new Error();
    err.status = 403;
    err.message = 'No identifier (email or handle) provided.';
    return next(err);
  }


  if (!userInfo.password) {
    const err = new Error();
    err.status = 403;
    err.message = 'No password provided.';
    return next(err);
  }

  User.find({$or: [{'email':userInfo.identifier},{'handle':userInfo.identifier}]})
    .then(response => {
      if (!response.length) {
        const err = new Error();
        err.message = 'User not found';
        return next(err);
      }


      const userInfo = {};
      const jwtFields = ['email','name','id','handle','created'];
      jwtFields.forEach(field => {
        userInfo[field] = response[0]['_doc'][field];
      });

      userInfo.id = userInfo._id;
      delete userInfo._id;
      userInfo.iat = Date.now();
      userInfo.exp = dayAdder(userInfo.iat, 15);
      const authToken = jwt.sign(userInfo, JWT_SECRET);
      res.json({authToken});
    });
});

router.post('/checkavailablility', (req,res,next) => {
  const {identifier} = req.query;
  const {email,handle} = req.body;

  if (identifier === 'handle') {
    if (!handle) {
      const err = new Error();
      err.status = 400;
      err.message = 'No Handle specified';
      return next(err);
    }

    return  User.find({'handle':handle})
      .then(response => {
        if (response.length) {
          res.json({'status':'unavailable'});
        } else {
          res.json({'status':'available'});
        }
      })
      .catch(next);
  }

  if (identifier === 'email') {
    if (!email) {
      const err = new Error();
      err.status = 400;
      err.message = 'No email specified';
      return next(err);
    }

    User.find({'email':email})
      .then(response => {
        if (response.length) {
          res.json({'status':'unavailable'});
        } else {
          res.json({'status':'available'});
        }
      })
      .catch(next);
  }

  if (!identifier) {
    const err = new Error();
    err.message = 'No identifier specified in the request query';
    err.status = 400;
    return next(err);
  }
});




module.exports = router;