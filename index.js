"use strict";

var fsWriteStreamAtomic = require('fs-write-stream-atomic');
var once = require('once');
var destroy = require('destroy');
var getLock = require('./lib/lock-aquirer');

function getWriteStream(file, cb) {
  getLock(file, function(err, isLocked, release) {
    if (err || isLocked) {
      return cb(err, isLocked);
    }

    var timer = setTimeout(function() {
      ws.emit('error', new Error('timed out'));
    }, 9500);

    var cleanup = once(function cleanup() {
      clearTimeout(timer);
      release();

      setImmediate(function() {
        destroy(ws);
      });
    });

    // rename the 'temporary' file so that we can potentially remove it
    // in case the process dies in the middle of the write stream
    var ws = fsWriteStreamAtomic(file + '.LAWS-TMP');
    ws.__atomicTarget = file;

    // release the lock once the stream has finished its doing
    ws.once('finish', cleanup);
    ws.once('close', cleanup);
    ws.once('error', cleanup);

    // cb(err, isLocked, writeStream)
    cb(null, false, ws);
  });
}

module.exports = getWriteStream;
