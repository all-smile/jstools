#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
// The zip library needs to be instantiated:
// https://github.com/daraosn/node-zip http://stuk.github.io/jszip/
var zip = new require('node-zip')();

var root = path.join(__dirname, '../');

function addFile(instance, folder) {
  const files = fs.readdirSync(folder);
  for (let i = 0, len = files.length; i < len; i++) {
    const file = path.join(folder, files[i]);

    const stat = fs.statSync(file);
    if (stat.isDirectory()) {
      const folder = instance.folder(path.basename(file));
      addFile(folder, file);
    } else {
      if (path.extname(file) !== '.map') {
        instance.file(path.basename(file), fs.readFileSync(file));
      }
    }
  }
}

addFile(zip, path.join(root, 'dist'));
var data = zip.generate({ base64: false, compression: 'DEFLATE' });
// it's important to use *binary* encode
fs.writeFileSync('release.zip', data, 'binary');