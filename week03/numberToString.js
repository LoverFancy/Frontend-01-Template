// number 支持表达式、字面量、
const convertNumberToString = (number, type = 10) => {
  let integer = Math.floor(number);
  let fraction = number - integer;
  let string = '';
  while (integer > 0) {
    string = integer % type + '' + string;
    integer = Math.floor(integer / type)
  }
  return string + (fraction ? (fraction+'').replace(/^0\.$/, '.') : '');
}
