'use strict';

var StringArray = require('mongoose').model('StringArray'),
    LinkArray = require('mongoose').model('LinkArray');

var titleErrorLinks,
    socketErrorLinks,
    newLinks,
    topics,
    newTopics;


LinkArray.findOne({name: 'socketErrorLinks'}, function(err, obj) {
  if (err) { throw err; }
  socketErrorLinks = obj;
});

LinkArray.findOne({name: 'titleErrorLinks'}, function(err, obj) {
  if (err) { throw err; }
  titleErrorLinks = obj;
});

LinkArray.findOne({name: 'newLinks'}, function(err, obj) {
  if (err) { throw err; }
  newLinks = obj;
});

StringArray.findOne({name: 'topics'}, function(err, obj) {
  if (err) { throw err; }
  topics = obj;
});

StringArray.findOne({name: 'newTopics'}, function(err, obj) {
  if (err) { throw err; }
  newTopics = obj;
});



exports.socketErrorLinks = {
  push: function(data) {
    socketErrorLinks.push(data);
  }
};

exports.titleErrorLinks = {
  push: function(data) {
    titleErrorLinks.push(data);
  }
};

exports.newTopics = {
  push: function(data) {
    newTopics.push(data);
  },
  uniq: function() {
    return newTopics.uniq();
  }
};

exports.topics = {
  push: function(data) {
    topics.push(data);
  },
  get: function() {
    return topics.array;
  }
};