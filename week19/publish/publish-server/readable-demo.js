const http = require('http');
const readableToString = require('./utils.js');

// Create an HTTP tunneling proxy
const server = http.createServer(async (req, res) => {

  let aaa = await readableToString(req);
  for (let i of aaa) {
    console.log(i);
  }

  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  res.end('okay');

});

server.listen(8081)