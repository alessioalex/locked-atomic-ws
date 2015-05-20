## locked-atomic-ws

A combination of [fs-write-stream-atomic](https://github.com/npm/fs-write-stream-atomic) and [node-proper-lockfile](https://github.com/IndigoUnited/node-proper-lockfile) to ensure that no more than one (atomic) write stream can be used at a time for a certain file.
Since atomically streaming to a file requires a temporary file (&& fs.rename afterwords), aquiring a lock means preventing work in vain.

### Example

```js
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
```

### Status

Alpha, read the source code for more info on how this works. Needs tests.

### License

[MIT](http://alessioalex.mit-license.org/)
