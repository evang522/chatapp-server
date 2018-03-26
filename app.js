// Bring in all Dependencies
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const morgan = require('morgan');
const {PORT} = require('./config');
const Room = require('./models/rooms.models');

// JSON body parsing middleware
app.use(express.json());



// logging middleware
app.use(morgan('common'));


app.get('/', (req,res) => {
    res.send('This is an API server. You won\'t be seeing anything pretty at this url');
})


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
    })

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})

