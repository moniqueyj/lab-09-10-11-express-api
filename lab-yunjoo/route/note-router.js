'use strict';

const Router = require('express').Router;
const noteRouter = module.exports = new Router();
const debug = require('debug')('note:note-router');
const AppError = require('../lib/app-error');
const storage = require('../lib/storage');
const Note = require('../model/note');
const bodyParser = require('body-parser').json();

function createNote(reqBody){
  debug('createNote');
  return new Promise(function(resolve, reject){
    var note;
    try {
      note = new Note(reqBody.content);
    } catch (err){
      reject(err);
    }
    storage.setItem('note', note).then(function(note){
      resolve(note);
    }).catch(function(err){
      reject(err);
    });
  });
}

noteRouter.post('/',bodyParser,function(req,res){
  debug('hit endpoint /api/note POST');
  createNote(req.body).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('interal server error');
  });
});
// function exampleMiddleWare(req,res,next){
//console.log('hello world');
//}
// noteRouter.post('/',bodyParser,exampleMiddleWare,function(req,res, next){
//   debug('hit endpoint /api/note POST');
//   createNote(req.body).then(function(note){
//     res.status(200).json(note);
//   }).catch(function(err){
//     console.error(err.message);
//     if(AppError.isAppError(err)){
//       res.status(err.statusCode).send(err.responseMessage);
//       return;
//     }
//     res.status(500).send('interal server error');
//     next();
//   });
// });

noteRouter.get('/:id', function(req, res){
  storage.fetchItem('note', req.params.id).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
    }
    res.status(500).send('interal server error');
  });
});

noteRouter.put('/:id', bodyParser, function(req,res){
  storage.putItem('note', req.params.id, req.body).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    console.error(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
      return;
    }
    res.status(500).send('interal server error');
  });
});
noteRouter.delete('/:id', function(req, res){
  storage.deleteItem('note', req.params.id).then(function(note){
    res.status(200).json(note);
  }).catch(function(err){
    console.err(err.message);
    if(AppError.isAppError(err)){
      res.status(err.statusCode).send(err.responseMessage);
    }
    res.status(500).send('interal server error');
  });
});
