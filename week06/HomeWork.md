### 课后作业：
> 使用状态机完成对 'abababx' 的处理

- [Finite State Machine](./stateMachine.js)

> 使用状态机处理完全未知的pattern
- [match](https://github.com/jay0815/match/blob/master/index.js)


> 完善toy brower中的通讯基础类、html解析工具、css解析绑定工具

* JavaScript版本
  - [server](./net/js/server.js)
  - [client](./net/js/client.js)
  - [html parser](./net/js/parser.js)
  - [css parser](./net/js/cssParser.js)

#### Todo

* [完成Selectors的文档梳理后，在CSSParser中补充对应功能](https://www.w3.org/TR/CSS2/selector.html#Selectors)
  * 在CSSParser中补充处理Universal selector(*)功能
  * 在CSSParser中补充处理Descendant selectors(' ')功能
  * 在CSSParser中补充处理Child selectors(>)功能
  * 在CSSParser中补充处理Adjacent sibling selectors(+)功能
  * 在CSSParser中补充处理Attribute selectors功能
    * [att]
    * [att=val]
    * [att~=val]
    * [att|=val]
  * 在CSSParser中补充处理 Pseudo-elements 和 pseudo-classes功能

* 完善ts版本的toy browser
