import * as net from 'net';
import ResponseParser from './ResponseParser';

export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  OPTION = 'OPTION',
}

interface RequestOptions {
  method?: Method,
  host: string;
  path: string;
  port: number;
  body?: {
    [key: string]: string | number
  };
  headers?: {
    [key: string]: string | number
  }
}

// base on net.createConnection

export default class Request {

  method: RequestOptions['method'];

  host: RequestOptions['host'];

  path: RequestOptions['path'];

  port: RequestOptions['port'];

  body: RequestOptions['body'];

  headers: RequestOptions['headers'];

  bodyText: string;

  constructor(options: RequestOptions) {
    this.method = options.method || Method.GET;
    this.host =  options.host;
    this.path =  options.path || '/';
    this.port = options.port || 80;
    this.body = options.body || {};
    this.headers = options.headers || {};
    this.bodyText = '';
    this.initContentType();
    this.convertBody();
  }

  initContentType(){
    if(!this.headers!['Content-Type']){
      this.headers!['Content-Type'] = 'application/x-www-form-urlencode';
    }
  }

  convertBody() {
    switch (this.headers!['Content-Type']) {
      case 'application/json':
        this.bodyText = JSON.stringify(this.body);
        break;
      case 'application/x-www-form-urlencode':
        this.bodyText = Object.keys(this.body!).map(
          (key) => `${key}=${encodeURIComponent(this.body![key])}`
        ).join('&');
        this.headers!['Content-length'] = this.bodyText.length;
        break;
      default:
        break;
    }
  }

  send(connection?: net.Socket) {
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
            connection!.write(this.toString())
          })
        }
        // response 中处理
        connection.on('data', (data) => {
          parser.receive(data);
          if(parser.isFinished){
            resolve(parser.response);
          }
          connection!.end();
        });
        connection.on('end', () => {
          console.log('disconnected from server');
        });
        connection.on('error', (err) => {
          // 产生异常时
          // 如果不加 catch, Promise 的 reject 产生的异常会一直冒泡到进程, 造成进程中断
          // UnhandledPromiseRejectionWarning
          reject(err);
          connection!.end();
          // console.log('已从服务器断开');
        });
      }
    ).catch((error) => {
      console.error(error);
    })
  }
}
