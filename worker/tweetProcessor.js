'use strict';

var urlexpand = require('urlexpand'),
    processLink = require('./linkProcessor.js');



function calcRank(tweet) {
  var favs = tweet.favorite_count || 0,
      retweets = tweet.retweet_count || 0,
      rank = favs + retweets;

  if (!!tweet.in_reply_to_status_id) {
    rank += 1;
  }

  return rank;
}

function processTweet(tweet, buzzr) {
  if (tweet.entities.urls && tweet.entities.urls.length > 0) {
    var link = tweet.entities.urls[0],
        url = link.expanded_url || link.url,
        rank = calcRank(tweet);

    urlexpand(url, processLink(rank, buzzr));
  }
}

module.exports = function(buzzr) {
  return function(tweet) {
    processTweet(tweet, buzzr);
  }
};