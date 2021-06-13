const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on Port:', 8000)
});