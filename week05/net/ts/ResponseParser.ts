// import FSM from './fsm';
import TrunkedBodyParser from './TrunkedBodyParser';
// state machine
const FINITE_STATE_MACHINE = {
  // parser status line
  WAITING_STATUS_LINE: 0,
  WAITING_STATUS_LINE_END: 1,
  // parser header
  WAITING_HEADER_NAME: 2,
  WAITING_HEADER_SPACE: 3,
  WAITING_HEADER_VALUE: 4,
  WAITING_HEADER_LINE_END: 5,
  WAITING_HEADER_BLOCK_END: 6,
  // parser body
  WAITING_BODY: 7
}


const {
  WAITING_STATUS_LINE, WAITING_STATUS_LINE_END,
  WAITING_HEADER_NAME, WAITING_HEADER_SPACE, WAITING_HEADER_VALUE,
  WAITING_HEADER_LINE_END, WAITING_HEADER_BLOCK_END,
  WAITING_BODY
} = FINITE_STATE_MACHINE;

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

export default class ResponseParser {

  CURRENT: number;

  STATUS_LINE: string;

  HEADERS: {
    [key: string]: string;
  };

  HEADER_NAME: string;

  HEADER_VALUE: string;

  bodyParser?: TrunkedBodyParser;

  // machine: FSM;

  RETURN = '\r'.charCodeAt(0);

  NEW_LINE = '\n'.charCodeAt(0);

  COLON = ':'.charCodeAt(0);

  SPACE = ' '.charCodeAt(0);

  constructor() {
    // 以解析 status line 开始
    // this.machine = new FSM({
    //     initial: WAITING_STATUS_LINE,
    //     states: {
    //         WAITING_STATUS_LINE: {
    //             transitions: {
    //                 isReturn: WAITING_STATUS_LINE_END,
    //                 record: WAITING_STATUS_LINE,
    //             }
    //         },
    //         WAITING_STATUS_LINE_END: {
    //             transitions: {
    //                 isNewLine: WAITING_HEADER_NAME
    //             }
    //         },
    //         WAITING_HEADER_NAME: {
    //             transitions: {
    //                 isColon: WAITING_HEADER_SPACE,
    //                 record: WAITING_HEADER_NAME
    //             }
    //         },
    //         WAITING_HEADER_SPACE: {
    //             transitions: {
    //                 isSpace: WAITING_HEADER_VALUE
    //             }
    //         },
    //         WAITING_HEADER_VALUE: {
    //             transitions: {
    //                 isReturn: WAITING_HEADER_NAME,
    //                 record: WAITING_HEADER_VALUE
    //             }
    //         }
    //     }
    // })
    this.CURRENT = FINITE_STATE_MACHINE.WAITING_STATUS_LINE;
    this.STATUS_LINE = '';
    this.HEADERS = {};
    this.HEADER_NAME = '';
    this.HEADER_VALUE = '';
  }

  get isFinished(){
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response() {
    this.STATUS_LINE.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
      return {
        statusCode: RegExp.$1,
        statusText: RegExp.$2,
        header: this.HEADERS,
        body: this.bodyParser!.content.join('')
      }
  }


  receive(buffer: Buffer) {
    const stream = buffer.toString();
    for(let i = 0; i< stream.length; i++){
       this.receiveCharter(stream.charAt(i))
    }
  }

  receiveCharter(char: string) {
  // switch 版本
      switch (this.CURRENT) {
        case WAITING_STATUS_LINE:
          // STATUS_LINE 以 \r 结束
          if(char === '\r'){
            this.CURRENT = WAITING_STATUS_LINE_END;
          }else {
            // 遇到\r 前都是 status line part
            this.STATUS_LINE += char;
          }
          break;
        case WAITING_STATUS_LINE_END:
          if(char === '\n'){
            this.CURRENT = WAITING_HEADER_NAME;
          }
          break;
        case WAITING_HEADER_NAME:
          if(char === ':'){
            this.CURRENT = WAITING_HEADER_SPACE;
          }else if(char === '\r'){
            this.CURRENT = WAITING_HEADER_BLOCK_END;
            if(this.HEADERS['Transfer-Encoding'] === 'chunked'){
              this.bodyParser = new TrunkedBodyParser()
            }
          }else {
            this.HEADER_NAME += char;
          }
          break;
        case WAITING_HEADER_SPACE:
          if(char === ' '){
            this.CURRENT = WAITING_HEADER_VALUE;
          }
          break;
        case WAITING_HEADER_VALUE:
          if(char === '\r'){
            this.CURRENT = WAITING_HEADER_LINE_END;
            this.HEADERS[this.HEADER_NAME] = this.HEADER_VALUE;
            this.HEADER_NAME = '';
            this.HEADER_VALUE  = '';
          }else {
            this.HEADER_VALUE += char;
          }
          break;
        case WAITING_HEADER_LINE_END:
          if(char === '\n'){
            this.CURRENT = WAITING_HEADER_NAME;
          }
          break;
        case WAITING_HEADER_BLOCK_END:
          if(char === '\n'){
            this.CURRENT = WAITING_BODY;
          }
          break;
        case WAITING_BODY:
          this.bodyParser!.receiveChar(char)
          break;
        default:
          break;
        }
  }
}
