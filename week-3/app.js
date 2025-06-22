const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, 'data.txt');

function readFileWithCallback(callback) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) return callback(err);
    callback(null, data);
  });
}

async function readFileWithAsyncAwait() {
  try {
    const data = await fsPromises.readFile(filePath, 'utf8');
    console.log( 'Async/Await Output:\n' + data);
  } catch (err) {
    console.log( 'Error (Async/Await): ' + err.message);
  }
}

console.log( '\n--- Callback Output ---');
readFileWithCallback((err, data) => {
  if (err) {
    console.log( 'Error (Callback): ' + err.message);
  } else {
    console.log( data);
    console.log( '\n--- Async/Await Output ---');
    readFileWithAsyncAwait();
  }
});
