var express = require('express');
var router = express.Router();
const unzipper = require('unzipper');
const https = require('https');

router.post('/', function (req, res, next) {

  const { token } = req.headers;

  const option = {
    hostname: 'api.github.com',
    path: '/user',
    port: 443,
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
  }

  const request = https.request(option, (response) => {
    let body = '';

    response.on('data', (d) => {
      body += d.toString();
    })
    response.on('end', () => {
      let user = JSON.parse(body);
      // auth check
      let writeStream = unzipper.Extract({
        path: '../server/public/'
      })
      writeStream.on('end', () => {
        res.send('ok');
      })
      req.pipe(writeStream);
      req.on('end', () => {
        res.end('okay');
      })
    })
  })

  request.setHeader('User-Agent', 'publish-tool')
  request.setHeader('Authorization', `token ${token}`)

  request.on('error', (e) => {
    console.log('index router error:', e)
  })

  request.end()

});

module.exports = router;
