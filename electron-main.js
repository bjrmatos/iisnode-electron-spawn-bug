'use strict';

var path = require('path');
var fs = require('fs');
var electron = require('electron');
var app = electron.app;

fs.writeFileSync(path.join(__dirname, 'electron-log.txt'), 'electron is running..');

console.log('main script in electron executing..');

app.on('window-all-closed', function () {
  if (process.connected) {
    process.send('exiting electron process..');
  }

  app.quit();
});

app.on('ready', function () {
  process.send('app ready..');
});
