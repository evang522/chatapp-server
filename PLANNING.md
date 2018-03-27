# Chat App
### An app that uses Node, React, Socket.io, and MongoDB to mimic popular chat applications in existence like Slack.


## Tech Stack
* MongoDB
* Mongoose
* Node.js
* Express.js
* Socket.io
* React
* MaterialUI


## Specs

### Broad Overview

Chat App will land on a main page that will describe what Chat app is, then show users how to create their own room.

A user will decide on the name of their room, and the room will be created, to be accessible at chatapp.com/theirname.  

When a user creates a room, the name will be sent to the server, which will then create a document in a room collection. The room collection will contain room documents which describe the members of the chat room, the secret key to enter the room, the channels available, and etc.

When the user visits the URL, they will be directed to a boilerplate chat React app page, which will send API requests based on the url specified. 

## API Endpoints

* USERS '/users'
    * name *text*
    * created *timestamp*
    * password *text*
    * email *email*
    * phone number *text*
* ROOMS '/rooms'
    * urlname *text*
    * title *text*
    * channels *array*
    * users *reference userId*
* MESSAGES '/messages'
    * created *timestamp*
    * body
    * user_id *ref-user*
    * room_id *ref-rooms*
    * channel_id *ref-channel-subobject*


## Client Behavior

On visiting a chat room, the react app will have a template that every chat room will share, but when the component mounts it will make use of the chat url to load the latest 20 messages from the chat room, defaulting to those in the general channel. The API call will be made based on 
1. The urlname of the chatroom (where-> {urlname: 'url'})
2. The seleted channel. defaulting to general. (where -> {channel = general})
3. Limiting to the last 30 messages or so

When a user submits a new message, the message will be sent to the database, and it will emit a new socket io event, which the sever will emit to all users in this room and channel. 





