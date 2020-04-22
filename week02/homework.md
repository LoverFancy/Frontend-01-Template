##  作业
### 1.写一个正则表达式 匹配所有 Number 直接量

```javascript
// 16进制
let HexDigit = /^0(x|X)[0-9a-fA-F]+$/;
// 8进制 (兼容旧版8进制)
let OctalDigits =  /^0(o|O)?[0-7]+$/;
// 2进制
let BinaryDigits =  /^0(b|B)[01]+$/;
// 实现科学计数法的10进制
let ExponentPart = /^[+-]?[0-9]+(\.[0-9]+)?(0{0,1}[1-9]?(e|E)[+-]?[0-9]+)?$/;
// 兼容校验16 | 10 | 8 | 2进制的正则
let NumericLiteral = /^[+-]?[0-9]+(\.[0-9]+)?(0{0,1}[1-9]?(e|E)[+-]?[0-9]+)?$|0[(b|B)[01]|(o|O)?[0-7]|(x|X)[0-9a-fA-F]]+$/
```

### 2.写一个 UTF-8 Encoding 的函数

> https://www.ietf.org/rfc/rfc3629.txt 实现标准

```javascript
function encodeUTF8(text) {
    // 使用 encodeURI api 将文本每个字符"UTF-8"化
    // encodeURIComponent 是遵照 https://tools.ietf.org/html/rfc3986 实现的
    // rfc3986 转义遵守rfc3629
    const utf8PS = encodeURIComponent(text);
    const bytes = [];
    let curr;
    for (let i = 0; i < utf8PS.length; i++) {
        //按照位置取值
        //ASCII 范围内不转义。ASCII范围外转成16进制值
        curr = utf8PS.charAt(i);
        if (curr === '%') {
          bytes.push(Number('0x'+utf8PS.charAt(i+1)+utf8PS.charAt(i+2)));
          i+=2
        }else {
          // 0x7F(ASCII 范围)以内
          // 00 to 7F hex (0 to 127): first and only byte of a sequence.
          // 所以需要手动转码
          bytes.push(curr.charCodeAt(0));
        }
    }
    return bytes
}
```

### 3.写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

```javascript
/[\u0021-\u007E]{6,16}|[\x21-\x7E]{6,16}|(['"])(?:(?!\1).)*?\1/g
```
