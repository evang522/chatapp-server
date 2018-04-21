'use strict';
// Bring in all Dependencies
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

// JSON body parsing middleware
app.use(express.json());

// CORS middleware
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// logging middleware
app.use(morgan('common'));




app.get('/', (req,res) => {
  res.send('This is an API server. You won\'t be seeing anything pretty at this url');
});


// Bring in API Resource Routes
app.use('/api', roomRoute);
app.use('/api', messageRoute);



app.use((err,req,res,next) => {
  err.message = err.message || 'Internal Server Error';
  err.status = err.status || 500;
  res.json({
    message: err.message,
    status: err.status
  });
});



mongoose.connect('mongodb://localhost/chatapp')
  .then(() => {
    console.log('db connected');
  })
  .catch(err => {
    console.log(err);
  });

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

