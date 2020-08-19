var express = require('express');
var router = express.Router();
const unzipper = require('unzipper');

/* GET home page. */
router.post('/', function (req, res, next) {
  let writeStream = unzipper.Extract({
    path: '../server/public/'
  })
  req.pipe(writeStream);
  req.on('end', () => {
    res.send('')
    res.end('okay');
  })
  res.end('okay');
});

module.exports = router;
