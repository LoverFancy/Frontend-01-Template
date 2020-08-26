const https = require('https');

function readableToString(readable) {
  return new Promise((resolve, reject) => {
    let data = '';
    readable.on('data', function (chunk) {
      data += chunk;
    });
    readable.on('end', function () {
      resolve(data);
    });
    readable.on('error', function (err) {
      reject(err);
    });
  });
}

const request = (option) => {

    return new Promise((resolve, reject) => {
      let data = '';

      const request = https.request(option, (response) => {
        response.on('data', (d) => {
          data += d;
        })
        response.on('end', () => {
          resolve(data);
        })
      })

      request.on('error', (e) => {
        console.log('error', e);
        reject(e);
      })

      request.end()
    });
}

module.exports = {
  request,
  readableToString
}
