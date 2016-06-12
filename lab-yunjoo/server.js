'use strict';
//npm module
const debug = require('debug')('note:server');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

//app module
const sendError = require('./lib/error-response');
const AppError = require('./lib/app-error');
const noteRouter = require('./route/note-router');
const port = process.env.PORT || 3000;
const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api/note',noteRouter);
app.all('*', sendError, function(req, res){
  const err = new AppError.error404('route not defined');
  debug('* 404');
  res.sendError(err);
});

const server = app.listen(port, function(){
  debug('listen');
  console.log('app up on port', port);
});

server.isRunning = true;
module.exports = server;
