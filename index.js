'use strict';

var https = require('https');

/**
 * Returns random item from an Array.
 *
 * @param  {Array} arr
 * @return {*}
 */
function randomItem(arr) {
  var r = (Math.random() * (arr.length - 1) + 0.5) | 0;
  return arr[r];
}


/** @type {Array=} Commit messages cache. */
var _cache = null;


/** @type {String} URL to the txt file with commit messages. */
var commitMessages = 'https://raw.githubusercontent.com/ngerakines/commitment/master/commit_messages.txt';


/**
 * Loads commit messages from a file asynchronously.
 *
 * @param  {Function} cb  Node-style callback.
 */
function loadCommitMessages(cb) {
  if (_cache) {
    process.nextTick(function () {
      cb(null, _cache);
    });
    return;
  }

  var req = https.get(commitMessages, function (res) {
    var body = '';

    res.on('data', function (chunk) {
      body += chunk;
    });

    res.on('end', function () {
      _cache = body.split('\n');

      if (typeof cb === 'function') {
        cb(null, randomItem(_cache).trim());
      }
    });
  });

  req.on('error', typeof cb === 'function' ? cb : function () {});
}

module.exports = loadCommitMessages;

