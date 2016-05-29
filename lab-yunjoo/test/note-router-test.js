'use strict';
const expect = require('chai').expect;
const request = require('superagent');
const server = require('../server');
const storage = require('../lib/storage');
const Note = require('../model/note');
const port = process.env.PORT || 3000;
const baseUrl = 'localhost:${port}/api/note';

describe('testing module note-router', function(){
  before((done)=>{
    if (!server.isRunning){
      server.listen(port, () => {
        server.isRunning = true;
        console.log('server running on port', port);
        done();
      });
      return;
    }
    done();
  });
  after((done) => {
    if(server.isRunning){
      server.close(() =>{
        server.isRunning = false;
        console.log('shutdown the server');
        done();
      });
      return;
    }
    done();
  });
  describe('testong POST/api/note', function(){
    describe('with body {content:"test note"}', function(){
      after((done)=>{
        storage.pool = {};
        done();
      });
      it('should return a note', function(done){
        request.post(baseUrl)
        .send({content:'test note'})
        .end((err, res) =>{
          expect(res.status).to.equal(200);
          expect(res.body.content).to.equal('test note');
          expect(!!res.body.id);
          done();
        });
      });
    });
    describe('with no body', function(){
      it('should return a note', function(done){
        request.post(baseUrl)
        .end((err, res) =>{
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('bad request');
          done();
        });
      });
    });
  });
  describe('testing GET/api/note', function(){
    before((done) => {
      this.tempNote = new Note('test data');
      storage.setItem('note', this.tempNote);
      done();
    });
    after((done) => {
      storage.pool = {};
      done();
    });
    it('should return a note',(done) =>{
      request.get('${baseUrl}/${this.tempNote.id}')
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.content).to.equal(this.tempNote.content);
        expect(res.body.id).to.equal(this.tempNote.id);
        done();
      });
    });
  });
});
