const convertStringToNumber = (string, type = 10) => {
  // 校验当前进制下的字符串内容是否合法
  if(valild(string, type)){
    // 字符串开头如果存在进制标识，移除
    const vaildString = format(string, type);
    let chars = vaildString.split('');
    let integer = 0;
    let index = 0;
    const zero = '0'.codePointAt(0);
    // d-value: 16进制 a 与 数字 之间存在 特殊符号的间隔，所以 A-0 = 16，需要消除间距
    const dValue = type === 16 ? 'A'.codePointAt(0) - ':'.codePointAt(0) : 0;

    while(index < vaildString.length &&  vaildString[index] !== '.'){
      integer = integer * type;
      // 16 进制存在 字母的大小写，所以需要统一转成大写。数字不存在大小写，所以无影响
      integer += vaildString[index].toLocaleUpperCase().codePointAt(0) - zero - dValue;
      index++
    }

    if(type === 10){
      // deal with exponential
      if(type === 10 && vaildString[index] === 'e'){
        index++;
        let times = 1;
        if(['+', '-'].includes(vaildString[index])){
          times *= vaildString[index]+1;
        }
        let exponent = 0;
        while(index < vaildString.length){
          exponential = exponent*10 + (+vaildString[index])
          index++
        }
        integer *= exponent
      }

      // faction
      if(vaildString[index] === '.'){
        index++
      }
      let faction = 1;
      while(index < vaildString.length){
        faction = faction / type;
        integer += (vaildString[index].codePointAt(0) - zero) * faction;
        index++
      }
    }

    return integer
  }
}

const regMap = {
  16: /^(0(x|X))?[0-9a-fA-F]+$/,
  10: /^[+-]?[0-9]+(\.[0-9]+)?(0{0,1}[1-9]?(e|E)[+-]?[0-9]+)?$/,
  8: /^(0(o|O)?)?[0-7]+$/,
  2: /^(0(b|B))?[01]+$/
}

const valild = (integer, type) => {
  let reg = regMap[type];
  if(reg){
    return reg.test(integer)
  }else {
    throw new Error('invalid number type')
  }
}

const format = (string, type) => {
  let reg = ''
  if(type === 16){
    reg = /0(x|X)/;
  }else if(type === 8) {
    reg = /0(o|O)/;
  }else if(type === 2) {
    reg = /0(b|B)/;
  }
  return string.replace(reg, '');
}
