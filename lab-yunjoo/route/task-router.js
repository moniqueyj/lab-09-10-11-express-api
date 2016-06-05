'use strict';

const Router = require('express').Router;
const debug = require('debug')('rito:task-router');
const jsonParser = require('body-parser').json();
const taskCrud = require('../lib/task-crud');
const taskRouter = module.exports = new Router();

taskRouter.post('/task', jsonParser, function(req, res){
  debug('Creating content');
  taskCrud.create(req.body)
  .then(task => res.sen(task))
  .catch(err => res. sendError(err));
});
