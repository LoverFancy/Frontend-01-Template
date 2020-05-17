const FINITE_STATE_MACHINE = {
  // text length
  WAITING_LENGTH: 0,
  WAITING_LENGTH_LINE_END: 1,
  // value
  READING_TRUNK: 2,
  // zero
  WAITING_NEW_LINE: 3,
  WAITING_NEW_LINE_END: 4,
}

const {
  WAITING_LENGTH, WAITING_LENGTH_LINE_END,
  READING_TRUNK,
  WAITING_NEW_LINE, WAITING_NEW_LINE_END
} = FINITE_STATE_MACHINE;

export default class TrunkedBodyParser {

  length: number;
  content: string[];
  isFinished: boolean;
  current: number;

  constructor() {
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = WAITING_LENGTH;
  }

  receiveChar(char: string) {
    switch (this.current) {
      case WAITING_LENGTH:
        if(char === '\r'){
          if(this.length == 0){
            this.isFinished= true;
          }else {
            // 当 length 为 0, 不应继续执行状态改变
            this.current = WAITING_LENGTH_LINE_END;
          }
        }else {
          this.length *= 16;
          this.length += parseInt(char, 16);
        }
        break;
      case WAITING_LENGTH_LINE_END:
        if(char === '\n'){
          this.current = READING_TRUNK;
        }
        break;
      case READING_TRUNK:
        this.content.push(char);
        this.length --;
        if(this.length === 0){
          this.current = WAITING_NEW_LINE;
        }
        break;
      case WAITING_NEW_LINE:
        if(char === '\r'){
          this.current = WAITING_NEW_LINE_END;
        }
        break;
      case WAITING_NEW_LINE_END:
        if(char === '\n'){
          this.current = WAITING_LENGTH;
        }
        break;
      default:
        break;
    }
  }
}
