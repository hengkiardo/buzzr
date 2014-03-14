'use strict';

// example:
// require('./worker/getLink.js')('http://google.com')

var request = require('request'),
    cheerio = require('cheerio'),
    logger = require('./logger.js');

module.exports = function (shortUrl, cb) {
  request(
  {
    method: 'GET',
    url: shortUrl,
    followAllRedirects: true,
    timeout: 6000,
    headers: {
      'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 ' +
      '(KHTML, like Gecko) Chrome/33.0.1750.149 Safari/537.36'
    }
  },
  
  function (err, response, body) {
    if (err || response.statusCode !== 200) {
      logger.error('URL ERROR', shortUrl, err, response.statusCode);
      return cb(err, {
        url: shortUrl,
        title: ''
      });
    }

    var $ = cheerio.load(body),
        title = $('title').first().text();

    cb(err, {
      url: response.request.href,
      title: title
    });
  });
};

