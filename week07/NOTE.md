# 第七周总结

### layout
* 分行
  * 根据主轴方向确定需要的主轴尺寸取值
  * 根据主轴尺寸，对元素按照行进行分组

* 计算主轴
  * 根据flex-wrap确定尺寸计算方式
    * 换行
      * 找出当前所有flex元素
      * 当前行主轴按剩余大小按比例分配给当前行的flex元素
    * 不换行
      * 所有元素排列在同一行
      * 若剩余空间为负数，所有flex元素0, 等比压缩剩余元素

* 计算交叉轴
  * 根据每一行中最大的元素确定当前行高
  * 根据flex-align、item-align 和 align-self确定元素位置

### render

> 使用了images库进行绘制

* 目前只能对图形进行render
* 实现文字渲染需要借助[skia](https://skia.org/user/api/skcanvas_overview)相关库

### CSS

- ![css.png](./css.png)
