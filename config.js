'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  DB_URL: process.env.DB_URL || 'mongodb://localhost/chatapp'
};