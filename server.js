'use strict';

var path = require('path'),
    childProcess = require('child_process'),
    http = require('http'),
    electronPath = require('electron-prebuilt');

var PORT = process.env.PORT || 4500;

var server = http.createServer(function(req, res) {
  var isDone = false;
  var timeoutId;

  if (req.url !== '/') {
    return;
  }

  console.log('request:', req.url);

  console.log('creating electron child process from:', electronPath);

  var child = childProcess.spawn(electronPath, [path.join(__dirname, 'electron-main.js')], {
    env: {
      ELECTRON_ENABLE_LOGGING: true
    },
    stdio: [null, process.stdout, process.stderr, 'ipc']
  });

  child.on('error', function (err) {
    console.log('error in electron child process..');

    if (isDone) {
      return;
    }

    isDone = true;
    clearTimeout(timeoutId);

    if (child.connected) {
      child.disconnect();
    }

    child.kill();

    res.statusCode = 500;
    res.end('Error: ' + err.message);
  });

  child.on('message', function (childData) {
    console.log('receiving message from electron child process:', childData);

    if (child.connected) {
      child.disconnect();
    }

    child.kill();

    res.statusCode = 200;
    res.end('Ok!');
  });

  timeoutId = setTimeout(function () {
    if (isDone) {
      return;
    }

    isDone = true;

    if (child.connected) {
      child.disconnect();
    }

    child.kill();

    res.statusCode = 500;
    res.end('Timeout Error');
  }, 30000);
});

server.on('error', function (e) {
  if (e.code == 'EADDRINUSE') {
    console.error('Address', PORT, 'in use..', e.message);
  } else {
    console.error(e.message);
  }
});

server.listen(PORT, function() {
  console.log('Server started on:', this.address().port);
});