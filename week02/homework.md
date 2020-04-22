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

```javascript
function encodeUTF8(text) {
    // 使用 encodeURI api 将文本 utf-8 化，但是会存在 %
    const utf8WithSymbol = encodeURIComponent(text);
    const bytes = [];
    let curr;
    for (let i = 0; i < utf8WithSymbol.length; i++) {
        curr = utf8WithSymbol.charAt(i);
        if (curr !== '%') {
          bytes.push(curr.charCodeAt(0));
        }
    }
    return utf8WithSymbol.reduce((p, _, index) => {
      curr = utf8WithSymbol.charAt(index);
      if(urr !== '%'){
        p.push(curr.charCodeAt(0))
      }
      return p;
    }, [])
}
```

### 3.写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

```javascript
/[\u0021-\u007E]{6,16}|[\x21-\x7E]{6,16}|(['"])(?:(?!\1).)*?\1/g
```
