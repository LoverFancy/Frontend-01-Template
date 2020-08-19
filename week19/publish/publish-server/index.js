const http = require('http');
// const fs = require('fs');
const unzipper = require('unzipper');

// fs.createReadStream('path/to/archive.zip')
//   .pipe(unzipper.Extract({
//     path: 'output/path'
//   }));

// Create an HTTP tunneling proxy
const server = http.createServer((req, res) => {
  // let mathced = req.url.match(/filename=([^&]+)/)
  // let filename = mathced && mathced[1];
  // if (!filename) {
  //   return
  // }
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