'use strict';

const debug = require('debug')('rito:note-crud');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const Task = require('../model/task');
const noteCrud = require('./note-crud');
const AppError = require('./app-error');

exports.createTask = function(reqBody){
  debug('creating task');
  return new Promise((resolve, reject) => {
    if(! reqBody.noteId)
      return reject(AppError.error400('tasks require noteID'));
    if(! reqBody.desc)
      return reject(AppError.error400('tasks require a desc'));
    Task.save()
    .then(task => resolve(task))
    .catch(err => reject(err));
  });
};

exports.fetchTaskByNoteId = function(noteId){
  return new Promise((resolve, reject) => {
    noteCrud.fetchNote({_id: noteId})
    .then(note =>Task.finc({noteId: note._id}))
    .then(tasks => resolve(tasks))
    .catch(err => reject(err));
  });
};

exports.removeAllTasks = function(){
  return Task.remove({});
};
