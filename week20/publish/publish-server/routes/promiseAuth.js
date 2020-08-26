var express = require('express');
var router = express.Router();
const {
  request
} = require('../utils.js');

/* GET home page. */
router.get('/', async function (req, res, next) {
  const code = req.url.match(/code=([\s\S]+)/)[1];
  const scope = encodeURIComponent('read:user')
  const client_secret = "91d3ea74bd496e9a5f07444bc9594d988054101a"
  const client_id = "Iv1.99fc6202d3e82a0a"
  const redirect_uri = encodeURIComponent("http://localhost:8081/auth");
  const getCode = `client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;
  const getAuthToken = `code=${code}&client_secret=${client_secret}&` + getCode

  const response = await request({
    hostname: 'github.com',
    port: 443,
    path: `/login/oauth/access_token?${getAuthToken}`,
    method: 'POST'
  });

  let result = response.toString().match(/access_token=([^&]+)/);

  if (result) {
    res.redirect(301, `http://localhost:8080/publish?access_token=${result[1]}`);
  } else {
    res.writeHead(200, {
      'Content-Type': 'text/plain'
    })
    res.end('error');
  }

});

module.exports = router;
