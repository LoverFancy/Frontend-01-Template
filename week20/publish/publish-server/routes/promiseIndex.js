var express = require('express');
var router = express.Router();
const unzipper = require('unzipper');
const {
  request
} = require('../utils.js');

router.post('/', async function (req, res, next) {

  const {
    token
  } = req.headers;

  const option = {
    hostname: 'api.github.com',
    path: '/user',
    port: 443,
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    headers: {
      'User-Agent': 'publish-tool',
      'Authorization': `token ${token}`
    }
  }

  const responese = await request(option);

  const user = JSON.parse(responese);

  if (user) {
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
  }

});

module.exports = router;
