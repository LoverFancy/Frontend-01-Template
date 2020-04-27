const convertNumberToString = (number, type = 10) => {
  let integer = Math.floor(number);
  let fraction = number - fraction;
  let string = '';
  while (integer > 0) {
    string = integer % x + '' + string;
    integer = Math.floor(integer / x)
  }
  return string;
}
// TODO: 0 的处理; 小数位无法处尽的 截断处理

const main = (number, type) => {
  let integer = Math.floor(number);
  let fraction = number - fraction;
  let string = '';
  while (integer > 0) {
    string = integer % x + '' + string;
    integer = Math.floor(integer / x)
  }
  return string;
}

// 16进制
let HexDigit = /^0(x|X)[0-9a-fA-F]+$/;
// 8进制 (兼容旧版8进制)
let OctalDigits =  /^0(o|O)?[0-7]+$/;
// 2进制
let BinaryDigits =  /^0(b|B)[01]+$/;
// 实现科学计数法的10进制
let ExponentPart = /^[+-]?[0-9]+(\.[0-9]+)?(0{0,1}[1-9]?(e|E)[+-]?[0-9]+)?$/;

const regMap = {
  16: /^0(x|X)[0-9a-fA-F]+$/,
  10: /^[+-]?[0-9]+(\.[0-9]+)?(0{0,1}[1-9]?(e|E)[+-]?[0-9]+)?$/,
  8: /^0(o|O)?[0-7]+$/,
  2: /^0(b|B)[01]+$/
}

const valild = (number, type) => {
  let reg = regMap[type];
  if(reg){
    return reg.test(number)
  }else {
    throw new Error('invalid number type')
  }
}
