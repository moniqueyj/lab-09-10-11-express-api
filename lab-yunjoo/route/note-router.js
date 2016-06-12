'use strict';

const Router = require('express').Router;
const noteRouter = module.exports = new Router();
const debug = require('debug')('note:note-router');
const sendError = require('../lib/error-response');
const storage = require('../lib/storage');
const Note = require('../model/note');
const bodyParser = require('body-parser').json();

//create data
function createNote(reqBody){
  debug('createNote');
  return new Promise(function(resolve, reject){
    var note;
    try {
      note = new Note(reqBody.content);
    } catch (err){
      return reject(err);
    }
    storage.setItem('note', note).then(function(note){
      resolve(note);
    }).catch(function(err){
      reject(err);
    });
  });
}

noteRouter.post('/',bodyParser, sendError, function(req,res){
  debug('hit endpoint /api/note POST');
  createNote(req.body).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    res.sendError(err);
  });
});

noteRouter.get('/:id', sendError,function(req, res){
  storage.fetchItem('note', req.params.id).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    res.sendError(err);
  });
});

noteRouter.put('/:id', bodyParser, sendError,function(req,res){
  storage.putItem('note', req.params.id, req.body).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    res.sendError(err);
  });
});

noteRouter.delete('/:id', sendError, function(req, res){
  storage.deleteItem('note', req.params.id).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    res.sendError(err);
  });
});
