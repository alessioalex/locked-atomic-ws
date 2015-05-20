"use strict";

var fs = require('fs');
var getWriteStream = require('../');

getWriteStream(__dirname + '/out.txt', function(err, isLocked, ws) {
  if (err) { throw err; }

  if (isLocked) {
    return console.error('please try again later');
  }

  // once we get here we are sure that nobody else (using this module)
  // is trying to write to the same file
  // also, the write-stream will be atomic (see https://github.com/npm/fs-write-stream-atomic/)

  ws.on('error', die);
  ws.on('close', function() {
    console.log('all done');
  });

  var rs = fs.createReadStream(__filename);

  rs
    .on('error', die)
    .pipe(ws)
});

function die(err) {
  throw err;
}
