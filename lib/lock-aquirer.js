"use strict";

var lockfile = require('proper-lockfile');

function getLock(file, cb) {
  lockfile.lock(file, {
    realpath: false
  }, function(err, release) {
    if (err) {
      if (err.code === 'ELOCKED') {
        // Lock failed
        return cb(null, true);
      } else {
        return cb(err);
      }
    }

    // cb(err, isLocked, release)
    cb(null, false, release);
  });
}

module.exports = getLock;
