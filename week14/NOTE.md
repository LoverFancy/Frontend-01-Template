# 每周总结可以写在这里

### JSX

#### JSX的运行方式

> https://facebook.github.io/jsx/

* esNext 编译成 es5
* JSX 语法 编译成 由 React.createElement 调用的函数形式
* 最终使用 eval 执行编译成字符串 的 JSX 语法

#### 基于JSX的UI框架

* 使用webpack-dev-server 作为 web app, 实现代码的热更新
* 借助 babel/plugin-transform-react-jsx 中的 pragma 可以将 React.createElement 替换 成框架runtime的create方法, 可以获取到JSX 语法编译后的内容，从而实现 对JSX 的处理
* JSX 语法 编译后 是一个逐级嵌套的结构
* create的 入参分别是 target(标签名称字符串 或者 标签类), property(组件属性), children(嵌套的子组件)

#### 组件基类

* 当标签以小写字母开头时，此时target 为字符串。为处理此情况，可以构造一个 Wrapper 类 统一处理 html标签
* 当标签以大写字母开头时，此时target 为标签类。为处理此情况，可以构造一个 Pure 类 统一处理 自定义组件
* 发现 Pure 和 Wrapper 行为十分类似，Wrapper 可以视作一个 createElement时提前预知的 特殊类，所以抽象出 基础类 Pure

```javascript
class Pure {

  constructor({
    target,
    timer
  } = {
    target: 'div',
    timer: {}
  }) {
    this.root = document.createElement(target);
    this.slot = document.createDocumentFragment();
    this.props = new Map();
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    this.props.get('children').push(child);
  }

  mountTo(parent) {
    for (let child of this.props.get('children')) {

      if (child) {
        if (child.mountTo) {
          child.mountTo(this.root)
        } else {
          if (Array.isArray(child)) {
            child.map((i) => {
              i.mountTo(this.root)
            })
          }else {
            this.root.appendChild(child);
          }
        }
      }
    }
    this.slot.appendChild(this.root);
    if (this.render()) {
      this.render().mountTo(parent);
    } else {
      parent.appendChild(this.root);
    }
  }

  render() {
    return void 0;
  }
}
```
* Wrapper 则为实现了 html 事件监听的 子类
```javascript
class Wraper extends Pure {
  constructor(config) {
    super(config);
  }

  addEventListener(...rest) {
    this.root.addEventListener(...rest)
  }
}
```
* 自定义组件（即业务代码）只需要 作为 Pure 的子类实现即可
```javascript
class Parent extends Pure {
  constructor(){
    super();
    console.log(this);

  }
  render() {

    return <div>
      <header > {this.props.get('title')} </header>
      <content>
      {
        this.slot
      }
      </content>
      <footer>foot</footer>
    </div>
  }
}
class Child extends Pure {
  constructor() {
    super();
  }
  render() {
    return ...
  }
}
```
