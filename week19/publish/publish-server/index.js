const http = require('http');
// const fs = require('fs');
const unzipper = require('unzipper');

// Create an HTTP tunneling proxy
const server = http.createServer(async (req, res) => {

  let writeStream = unzipper.Extract({
    path: '../server/public/'
  })
  // let stream = fs.createWriteStream('../server/public/' + filename)
  req.pipe(writeStream);
  req.on('end', () => {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    });
    res.end('okay');
  })

});

server.listen(8081)