'use strict';
//================================== Require Dependencies ====================>
const express = require('express');
const router = express.Router();

//================================== Bring in Models ====================>
const User = require('../models/users.models');


//================================== GET /users ====================>
router.get('/users/:id', (req,res,next) => {
  const {id} = req.params;

  if (!id) {
    const err = new Error();
    err.status = 400;
    err.message = 'Message required ID parameter';
    return next(err);
  }

  User.findById(id)
    .then(user => {
      delete user.password;
      res.status(200).json(user);
    })
    .catch(err => {
      return next(err);
    });
});


//================================== POST /users ====================>
router.post('/users', (req,res,next) => {
  const requiredFields = ['name','password','email', 'handle'];

  const newUser = {};
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const err = new Error();
      err.message = `Missing ${field} field `;
      err.status = 400;
      return next(err);
    }

    if (field === 'password') {
      if (field.length < 8) {
        const err = new Error();
        err.status = 400;
        err.messsage = 'Password must be at least 8 characters';
        return next(err);
      }

      if (field.length !== field.trim().length) {
        const err = new Error();
        err.status = 400;
        err.message = 'Password contains white space';
        return next(err);
      }
    }

    newUser[field] = req.body[field];
  });

  User.create(newUser)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(err => {
      return next(err);
    });
});


module.exports = router;