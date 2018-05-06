'use strict';

//================================== Import Dependencies ====================>

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const {PORT} = require('./config');
const {CLIENT_ORIGIN} = require('./config');
const Room = require('./models/rooms.models');
const roomRoute = require('./routes/rooms.routes');
const cors = require('cors');
const messageRoute = require('./routes/messages.routes');
const userRouter = require('./routes/users.routes');
const {DB_URL} = require('./config');
require('dotenv').config();
const authRoute = require('./routes/auth.routes');
const jwtAuth = require('./utils/jwtauth.utils');
 

//================================== Set up Middleware ====================>

app.use(express.json());

// CORS middleware
app.use(
  cors()
);

// logging middleware
app.use(morgan('common'));


app.get('/', (req,res) => {
  res.send('This is an API server. You won\'t be seeing anything pretty at this url!');
});


// Bring in API Resource Routes
app.use('/api/auth', authRoute);
app.use('/api', userRouter);
app.use(jwtAuth);
app.use('/api', roomRoute);
app.use('/api', messageRoute);



app.use((err,req,res,next) => {
  err.message = err.message || 'Internal Server Error';
  err.status = err.status || 500;
  res.status(err.status).json({
    message: err.message,
    status: err.status
  });
});


// console.log(DB_URL);

mongoose.connect(DB_URL)
  .then(() => {
    console.log('db connected');
  })
  .catch(err => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

