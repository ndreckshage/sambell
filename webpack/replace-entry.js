const fs = require('fs');

module.exports = (serverPath, clientEntry, cb) =>
  fs.readFile(serverPath, 'utf8', (err, data) => {
    if (err) throw new Error(err);
    const result = data.replace(/{{SAMBELL_CLIENT_ENTRY}}/g, clientEntry);
    fs.writeFile(serverPath, result, 'utf8', err => {
      if (err) throw new Error(err);
      cb()
    });
  });
