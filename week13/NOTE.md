# 每周总结可以写在这里

## Toy Reactive

* 思路
  * 使用proxy 对象创建一个 可以感知并控制get、set行为的对象
  * 通过 map 进行依赖收集, 移除不必要的proxy对象的创建
  * 当 对象 层级变深时(即将值由 值类型 改为 引用类型时)，对新值进行reactive处理，保持对值变更的感知

## drag & drop

* 思路
  * 监听 dragtarget 的 mousedown
  * 当鼠标移至 dragtarget 外时，是不存在 mousemove, 所以 应该监听 document 的 mousemove
  * mouseup 同理
  * document 的 mousemove 和 mouseup 一定是以 dragtarget 的 mousedown 开始时开始，结束时结束
  * mouseup 时要 对 mousemove 和 mouseup 事件 remove
  * dragtarget 的位置应该是 base + (localStart - localEnd)

## 组件化

|Markup Set|JS Set|JS Change|User Input Change| |
|---|---|---|---|---|---|
|❌|✔️|✔️|❓|Property|
|✔️|✔️|✔️|❓|Attribute|
|❌|❌|❌|✔️|State|
|❌|✔️|❌|❌|Config|

* Attribute
  * 强调描述性
  * 获取、修改时需要对应的值的专有方法
* Property
  * 强调从属关系
  * 可以直接使用key获取值
* Children
  * Content: 直接渲染 children
  * Template: 通过 组件中Property中的特定属性控制 template的渲染数量与形式

```javascript
class Carousel {

  construct({ startIndex, loop, time, imgList, autoplay, color, forward }) {
    // attribute:
    this.startIndex = startIndex,
    this.loop = loop,
    this.time = time,
    this.imgList = imgList,
    this.autoplay = autoplay,
    this.color = color,
    this.forward = forward
  }

  state = {
    activeIndex: 0
  }

  property = {
    loop: () => {},
    time: 0,
    imgList: 0,
    color: '#000,
    forward: 'row'
  }

  // event:
  change(event) {

  }
  click(event) {

  }
  hover(event) {

  }
  swipe(event) {

  }
  resize(event) {

  }
  dbclick(event) {

  }

}
```