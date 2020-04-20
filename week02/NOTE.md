# 每周总结可以写在这里



```javascript
// 16进制
let HexDigit = /^0(x|X)[0-9a-fA-F]+$/;
// 8进制
let OctalDigits =  /^0(o|O)[0-7]+$/;
// 2进制
let BinaryDigits =  /^0(b|B)[01]+$/;
// 实现科学计数法的10进制
let ExponentPart = /^[+-]?([0-9]+(\.[0-9]+)?((e|E)[+-]?[0-9]+)?|Infinity)$/;
// 兼容校验16 | 10 | 8 | 2进制的正则
let NumericLiteral = /^[+-]?([0-9]+(\.[0-9]+)?((e|E)[+-]?[0-9]+)?|Infinity)$|0[(b|B)[01]|(o|O)[0-7]|(x|X)[0-9a-fA-F]]+$/
```

template
