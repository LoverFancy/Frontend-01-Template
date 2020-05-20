/**
 * @Author: qiancheng
 * @Date:   2020-05-16T18:46:51+08:00
 * @Last modified by:   qiancheng
 * @Last modified time: 2020-05-19T11:49:37+08:00
 */

// import * as net from 'net';
import Request, { Method } from './Request';

void async function() {
  let request = new Request({
    method: Method.GET,
    host: '127.0.0.1',
    port: 8088,
    path: '/',
    body: {
      name: 'jack'
    },
    headers: {
      ['X-Tor']: '32313'
    }
  })

  let response = await request.send();
  console.log(response);
}();

// const client = net.createConnection({
//   host: '127.0.0.1',
//   port: 8088
// }, () => {
//   // 'connect' 监听器
//   console.log('已连接到服务器');
//   client.write('GET / HTTP/1.1\r\n');
//   client.write('Host: 127.0.0.1\r\n');
//   client.write('Content-Type: application/x-www-form-urlencode / HTTP/1.1\r\n');
//   client.write('\r\n');
//   client.write('&write=1\r\n');
//   client.write('\r\n');
// });
// client.on('data', (data) => {
//   console.log(data.toString());
//   client.end();
// });
// client.on('end', () => {
//   console.log('已从服务器断开');
// });
