'use strict';

//npm modules
const debug = require('debug')('note:server');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

//app modules
const errorResponse = require('./lib/error-response');
const noteRouter = require('./route/note-router');
const taskRouter = require('./route/task-router');

//globals
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI || 'mongodb//localhost:rito';
const app = express();

//connet to database
mongoose.connect(mongoURI);

//middle ware
app.use(morgan('dev'));
app.use(errorResponse);

//routes
app.use('/api', noteRouter);
app.use('/api', taskRouter);
app.all('*', function(req, res){
  debug('* 404');
  res.status(404).send('not found');
});

const server = app.listen(port, function(){
  debug('listen');
  console.log('app up on port', port);
});

server.isRunning = true;
module.exports = server;
