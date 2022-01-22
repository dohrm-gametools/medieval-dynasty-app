const fs = require('fs');

if (process.argv.length !== 4) {
    throw 'invalid arguments : usage `node cp.js [source] [destination]`'
}

fs.cpSync(process.argv[2], process.argv[3], {force: true, recursive: true});

