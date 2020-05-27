const net = require('net');
const parser = require('./parser');
const images = require('images');
const render = require('./render');
class Request {
  // method url = host + port + path
  // body
  // header
  constructor(options) {
    this.method = options.method || 'GET';
    this.host =  options.host;
    this.path =  options.path || '/';
    this.port = options.port || 80;
    this.body = options.body || {};
    this.headers = options.headers || {};

    if(!this.headers['Content-Type']){
      this.headers['Content-Type'] = 'application/x-www-form-urlencode';
    }
    if(this.headers['Content-Type'] === 'application/json'){
      this.bodyText = JSON.stringify(this.body)
    }else if(this.headers['Content-Type'] === 'application/x-www-form-urlencode'){
      this.bodyText = Object.keys(this.body).map(
        (key) => `${key}=${encodeURIComponent(this.body[key])}`
      ).join('&');
      this.headers['Content-length'] = this.bodyText.length;
    }

  }

  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r\nHost: ${this.host}\r\n${
      Object.keys(this.headers).map(
        (key) => `${key}: ${this.headers[key]}`
      ).join('\r\n')
    }\r\n\r\n${this.bodyText}\r\n\r\n`;
  }

  open(method, url){

  }

  send(connection){
    return new Promise((resolve, reject) => {
        const parser = new ResponseParser();
        if(connection){
          connection.write(this.toString())
        }else {
          connection = net.createConnection({
            host: this.host,
            port: this.port
          }, () => {
            console.log('connected to server!');
            connection.write(this.toString())
          })
        }
        connection.on('data', (data) => {
          // data: Buffer
          // Buffer extends Uint8Array
          parser.receive(data.toString());
          if(parser.isFinished){
            resolve(parser.response);
          }
          connection.end();
        });
        connection.on('end', () => {
          console.log('disconnected from server');
        });
        connection.on('error', (err) => {
          reject(err);
          connection.end();
          // console.log('已从服务器断开');
        });
      }
    ).catch((error) => {
      console.error(error);
    })
  }
}

//  ----status line----
//  HTTP/1.1 200 OK
//  ----headers----
//  COntent-Type: text/html
//  Date: Mon, 23 Dec 2019 06:46:19 GMT
//  Connection: keey-alive
//  Transfer-Encoding: chunked
//  /r/n
//  /r/n
//  ----body----
//  start with: text.length, type is number
//  text
//  end with: 0

class Response {
  constructor() {

  }
}
// 负责产生 response
class ResponseParser {

  constructor() {
    // state machine
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;
    // 以解析 status line 开始
    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';

  }

  get isFinished(){
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
      return {
        statusCode: RegExp.$1,
        statusText: RegExp.$2,
        header: this.headers,
        body: this.bodyParser.content.join('')
      }
  }

  receive(string) {
    for(let i = 0; i< string.length; i++){
       this.receiveCharter(string.charAt(i))
    }
  }

  // 问题1 WAITING_STATUS_LINE 状态下什么时候会遇到 \n, \n应该是交给 WAITING_STATUS_LINE_END 处理呀

  receiveCharter(char) {
    // switch 版本
    switch (this.current) {
      case this.WAITING_STATUS_LINE:
        // STATUS_LINE 以 \r 结束
        if(char === '\r'){
          this.current = this.WAITING_STATUS_LINE_END;
        }else {
          // 遇到\r 前都是 status line part
          this.statusLine += char;
        }
        break;
      case this.WAITING_STATUS_LINE_END:
        if(char === '\n'){
          this.current = this.WAITING_HEADER_NAME;
        }
        break;
      case this.WAITING_HEADER_NAME:
        if(char === ':'){
          this.current = this.WAITING_HEADER_SPACE;
        }else if(char === '\r'){
          this.current = this.WAITING_HEADER_BLOCK_END;
          if(this.headers['Transfer-Encoding'] === 'chunked'){
            this.bodyParser = new TrunkedBodyParser()
          }
        }else {
          this.headerName += char;
        }
        break;
      case this.WAITING_HEADER_SPACE:
        if(char === ' '){
          this.current = this.WAITING_HEADER_VALUE;
        }
        break;
      case this.WAITING_HEADER_VALUE:
        if(char === '\r'){
          this.current = this.WAITING_HEADER_LINE_END;
          this.headers[this.headerName] = this.headerValue;
          this.headerName = '';
          this.headerValue  = '';
        }else {
          this.headerValue += char;
        }
        break;
      case this.WAITING_HEADER_LINE_END:
        if(char === '\n'){
          this.current = this.WAITING_HEADER_NAME;
        }
        break;
      case this.WAITING_HEADER_BLOCK_END:
        if(char === '\n'){
          this.current = this.WAITING_BODY;
        }
        break;
      case this.WAITING_BODY:
        this.bodyParser.receiveChar(char)
        break;
      default:
        break;
      }
  }
}

class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITING_LENGTH;
  }

  receiveChar(char) {
    switch (this.current) {
      case this.WAITING_LENGTH:
        if(char === '\r'){
          if(this.length == 0){
            this.isFinished= true;
          }else {
            // 当 length 为 0, 不应继续执行状态改变
            this.current = this.WAITING_LENGTH_LINE_END;
          }
        }else {
          this.length *= 16;
          this.length += parseInt(char, 16);
        }
        break;
      case this.WAITING_LENGTH_LINE_END:
        if(char === '\n'){
          this.current = this.READING_TRUNK;
        }
        break;
      case this.READING_TRUNK:
        this.content.push(char);
        this.length --;
        if(this.length === 0){
          this.current = this.WAITING_NEW_LINE;
        }
        break;
      case this.WAITING_NEW_LINE:
        if(char === '\r'){
          this.current = this.WAITING_NEW_LINE_END;
        }
        break;
      case this.WAITING_NEW_LINE_END:
        if(char === '\n'){
          this.current = this.WAITING_LENGTH;
        }
        break;
      default:
        break;
    }
    // if(this.current === this.WAITING_STATUS_LINE){
    //   if(char === '\r'){
    //     this.current = this.WAITING_STATUS_LINE_END;
    //   }else {
    //     this.statusLine += char;
    //   }
    // }else if(this.current === this.WAITING_STATUS_LINE_END){
    //   if(char === '\n'){
    //     this.current = this.WAITING_HEADER_NAME;
    //   }
    // }else if(this.current === this.WAITING_HEADER_NAME){
    //   if(char === ':'){
    //     this.current = this.WAITING_HEADER_SPACE;
    //   }else if(char === '\r'){
    //     this.current = this.WAITING_HEADER_BLOCK_END;
    //     if(this.headers['Transfer-Encoding'] === 'chunked'){
    //       this.bodyParser = new TrunkedBodyParser();
    //     }
    //   }else {
    //     this.headerName += char;
    //   }
    // }else if(this.current === this.WAITING_HEADER_SPACE){
    //   if(char === ' '){
    //     this.current = this.WAITING_HEADER_VALUE;
    //   }
    // }else if(this.current === this.WAITING_HEADER_VALUE){
    //   if(char === '\r'){
    //     this.current = this.WAITING_HEADER_LINE_END;
    //     this.headers[this.headerName] = this.headerValue;
    //     this.headerName = '';
    //     this.headerValue = '';
    //   }else {
    //     this.headerValue += char;
    //   }
    // }else if(this.current === this.WAITING_HEADER_LINE_END){
    //   if(char === '\n'){
    //     this.current = this.WAITING_HEADER_NAME;
    //   }
    // }else if(this.current === this.WAITING_HEADER_BLOCK_END){
    //   if(char === '\n'){
    //     this.current = this.WAITING_BODY;
    //   }
    // } else if(this.current === this.WAITING_BODY){
    //   this.bodyParser.receiveChar(char)
    // }
  }
}


void async function() {
  let request = new Request({
    method: 'POST',
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

  let dom = parser.parserHTML(response.body);

  console.log(JSON.stringify(dom));

  let view = images(800, 600);

  render(view, dom);

  view.save('dom.jpg');
}();


// const client = net.createConnection({
//   host: '127.0.0.1',
//   port: 8088
// }, () => {
//   // 'connect' 监听器
//   console.log('已连接到服务器');
//
//   let request = new Request({
//     method: 'POST',
//     host: '127.0.0.1',
//     port: 8088,
//     path: '/',
//     header: {
//       'X-Foo': '333'
//     },
//     body: {
//       name: 'jack'
//     }
//   })
//
//   // console.log(request.toString());
//
//   console.log(request);
//   client.write('GET / HTTP/1.1\r\n');
//   client.write('Host: 127.0.0.1\r\n');
//   client.write('Content-Type: application/x-www-form-urlencoded\r\n');
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
