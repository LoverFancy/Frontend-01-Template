# 每周总结可以写在这里

## SFC
> 组件化的另一种方式

ReactJS 中是通过 jsx 生成一种 dom 结构的类AST对象，VueJS 则提供了另一种方式「SFC」(Single File Components)

### 实现思路
其实就是对一种特定结构的文本进行处理
* 借助 webpack的loader,对指定类型文件做处理
* 使用自定义 loader 解析 文件 中的 HTML 相关tag
  * 复用了之前 的 html parse 状态机做处理，为了支持 文件中的script，在 parse 中增加了对 script 的处理
* 根据 loader 返回的结构 生成 DOMTree

## Animation

* css 中的 transition、animation 等属性实现
* js 中的替换 getComputedStyle  transition、animation 等属性 来实现

### 动画库为什么要用 js 来实现 ?

* css 无法实现很好实现动画的开始、暂停、从暂停部分开始、重新开始、循环等状态变更的功能
* js 可以很好的记录 动画的位置、状态
* js 动画 多修改transform，不会触发重排，所以性能方面基本没有问题

使用JS实现Animation时，常使用 requestAnimationFrame、setInterval、setTimeOut

### Timeline

Timeline是一个提供了对时间状态管理的状态集合，通过 Timeline 可以同时管理多个动画
