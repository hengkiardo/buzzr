'use strict';

var Buzzr = require('mongoose').model('Buzzr');
var buzzrCreator = require('child_process').fork('server/utils/buzzrCreator.js');

exports.getByTopic = function (req, res) {
  var topic = decodeURI(req.params.id).toLowerCase().trim();

  Buzzr.findOne({topic: topic}).exec(function (err, buzzr) {
    if (err) { return res.json({err: err}); }
    
    if (!buzzr) {
      buzzrCreator.send({topic: topic});
      return res.json({links: []});
    }
    
    buzzr.viewed();
    res.send({links: buzzr.activeLinks});
  });
};
