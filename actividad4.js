const fs = require('fs');
const readable = fs.createReadStream('entrada.txt');
const writable = fs.createWriteStream('salida_controlada.txt');

readable.on('data', chunk => {
  if (!writable.write(chunk)) {
    readable.pause();
  }
});

writable.on('drain', () => readable.resume());