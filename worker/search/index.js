'use strict';

var arr = require('../../server/utils/arrays.js'),
    Buzzr = require('mongoose').model('Buzzr'),
    twitter = require('./twitter.js');

var EventEmitter = require('events').EventEmitter,
    ee = new EventEmitter();

var currentTopic = -1;


function updateBuzzr(err, buzzr) {
  if (err) {
    if (err.toString().indexOf('E11000') > -1) {
      console.log('DUB BUZZR ERROR');
      arr.newTopics.update(function() {
        ee.emit('next');
      });
    }
    else {
      throw err;
    }
  }
  if (!buzzr) { return ee.emit('reset'); }
  ee.emit('update', buzzr);
}


function nextEvent() {
  var topics = arr.topics.get(),
      topic = topics[++currentTopic % topics.length];
  
  Buzzr.findOne({topic: topic}, updateBuzzr);
}

function reset() {
  setTimeout(function() {
    arr.newTopics.update(function() {
      ee.emit('next');
    });
  }, 20000);
}

function continueEvent() {
  ee.emit('reset');
}

function update(currentBuzzr) {
  twitter.update(currentBuzzr, ee);
}

ee.on('continue', continueEvent);
ee.on('next',     nextEvent);
ee.on('update',   update);
ee.on('reset',    reset);


module.exports = function(app) {
  app.listen(8080);
  console.log('listening on port 8080');
  
  setTimeout(function() {
    ee.emit('reset');
  }, 3000);
};
