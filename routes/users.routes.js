'use strict';
//================================== Require Dependencies ====================>
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

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

    // Validation
    if (!(field in req.body)) {
      const err = new Error();
      err.message = `Missing ${field} field `;
      err.status = 400;
      return next(err);
    }

    if (field === 'password') {
      if (req.body[field].length < 8) {
        const err = new Error();
        err.status = 400;
        err.messsage = 'Password must be at least 8 characters';
        return next(err);
      }

      if (req.body[field].length !== req.body[field].trim().length) {
        const err = new Error();
        err.status = 400;
        err.message = 'Password contains white space';
        return next(err);
      }
    }
    
    if (field === 'handle') {
      if (req.body[field].indexOf('@') !== -1) {
        const err = new Error();
        err.message = 'Handles may not contain @ character';
        err.status = 400;
        return next(err);
      }
    }

    if (field === 'email') {
      const email = req.body[field];
      if (!email.indexOf('@') === -1) {
        const err = new Error();
        err.message = 'Invalid email format';
        err.status = 400;
        return next(err);
      }

      if (!email.indexOf('.') === -1) {
        const err = new Error();
        err.message = 'Invalid email format';
        err.status = 400;
        return next(err);
      }
    }

    newUser[field] = req.body[field];
  });


  User.find({$or: [{'email':newUser.email},{'handle':newUser.handle}]})
    .then(response => {
      if (response.length) {
        const err = new Error();
        err.status = 400;
        err.message = 'User with this handle or email already exists';
        return next(err);
      }

      bcrypt.hash(newUser.password,10,(err,hash) => {
        if (err) {
          return next(err);
        } 
    
        // Assign hashed password to new user object.
        newUser.password = hash;  
    
        User.create(newUser)
          .then(response => {
            res.status(201).json(response);
          })
          .catch(err => {
            return next(err);
          });  
      });


    });






});


module.exports = router;