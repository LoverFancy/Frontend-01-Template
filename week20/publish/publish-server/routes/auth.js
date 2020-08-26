var express = require('express');
var https = require('https');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const code = req.url.match(/code=([\s\S]+)/)[1];
  const scope = encodeURIComponent('read:user')
  const client_secret = "0b8782216a211ac350035367875f68fa9e76cee8"
  const client_id = "Iv1.99fc6202d3e82a0a"
  const redirect_uri = encodeURIComponent("http://localhost:8081/auth");
  const getCode = `client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;
  const getAuthToken = `code=${code}&client_secret=${client_secret}&` + getCode

  const request = https.request({
    hostname: 'github.com',
    port: 443,
    path: `/login/oauth/access_token?${getAuthToken}`,
    method: 'POST'
  }, (r) => {
    r.on('data', (d) => {
      let result = d.toString().match(/access_token=([^&]+)/);
      if (result) {
        res.redirect(301, `http://localhost:8080/publish?access_token=${result[1]}`);
      }else {
        res.writeHead(200, {
          'Content-Type': 'text/plain'
        })
        res.end('error');
      }
    })
  })
  request.on('error', (e) => {
    console.log(e);
  })
  request.end()
});

module.exports = router;
