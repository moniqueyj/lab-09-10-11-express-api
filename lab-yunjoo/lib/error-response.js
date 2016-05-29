'use strict';


const debug = require('debug')('note:error-response');
const AppError = require('./app-error');
module.exports = function(req, res, next){
  debug('send Error');
  res.senError = function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('interal server error');
  };
  next();
};
