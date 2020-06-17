# 每周总结可以写在这里

# Range
> Range 接口表示一个包含节点与文本节点的一部分的文档片段。
## 创建方法
* document.createRange()
* window.getSelection().getRangeAt(Number)
* new Range()
## 定义来源
* [DOM-Level-2-Traversal-Range](https://www.w3.org/TR/DOM-Level-2-Traversal-Range/ranges.html#Level2-DocumentRange-method-createRange)
## 操作DOM的手术刀
* 通过这个对象可以选择文档中的某个区域，而不必考虑节点的界限。
## Attribute
|属性|Type|描述|
|---|---|---|
|collapsed|Boolean|表示Range的起始和终止位置是否相同|
|commonAncestorContainer|Node|包含 startContainer 和 endContainer 的有深度的节点|
|endContainer|Node|包含Range终点的节点|
|endOffset|Number|Range终点在endContainer中的位置|
|startContainer|Node|包含Range起点的节点|
|startOffset|Number|Range起点在startContainer中的位置|
## Method
|方法|描述|
|---|---|
|setStart|设置Range的起点|
|setEnd|设置Range的终点|
|setStartBefore|以其他DOM节点为基准，设置Range的起点|
|setStartAfter|以其他DOM节点为基准，设置Range的起点|
|setEndBefore|以其他DOM节点为基准，设置Range的终点|
|setEndAfter|以其他DOM节点为基准，设置Range的终点|
|selectNode|选择节点|
|selectNodeContents|选择节点的内容|
|collapse|将Range折叠至起点或重点|
|cloneContents|返回一个包含 Range 中所有节点的文档片段|
|deleteContents|从文档中移除 Range 包含的内容|
|extractContents|把 Range 的内容从文档树移动到一个文档片段中|
|insertNode|在 Range 的起点处插入一个节点|
|surroundContents|将 Range 的内容移动到一个新的节点中|
|compareBoundaryPoints|比较两个 Range 的端点|
|cloneRange|返回拥有和原 Range 相同的端点的克隆 Range 对象|
|detach|将 Range 从使用状态中释放，改善性能|
|toString|把 Range 的内容作为字符串返回|
## Example
* [dom节点翻转](./reverseDom.html)

## Notice
> ___Range对CSS Variable、CSSOM StyleSheet 同样有效___

# All Apis In Window

## 从以下主地址对800个api进行了对应标准的确认
* http://www.ecma-international.org/
* http://www.khronos.org/registry/webgl/
* https://www.w3.org/TR/
* https://wicg.github.io/wicg.io/
* https://compat.spec.whatwg.org/
* https://console.spec.whatwg.org/
* https://dom.spec.whatwg.org/
* https://html.spec.whatwg.org/
* https://storage.spec.whatwg.org/
* https://streams.spec.whatwg.org/
* https://url.spec.whatwg.org/
* https://xhr.spec.whatwg.org/
* https://drafts.css-houdini.org/worklets/
* https://drafts.csswg.org/
* https://drafts.fxtf.org/
* https://w3c.github.io/
* https://heycam.github.io/webidl/
* https://webbluetoothcg.github.io/web-bluetooth
* https://immersive-web.github.io/webxr/
* https://webassembly.github.io/spec/js-api/
## Gecko standard
* https://dxr.mozilla.org/mozilla-central/source/dom/webidl/XSLTProcessor.webidl
* https://developer.mozilla.org/en-US/docs/Web/API/Window/find

### defaultStatus、defaultstatus
这两个属性作为edit draft内容被chrome实现, 但是在后续工作组邮件沟通后, 从标准中移除
* https://lists.w3.org/Archives/Public/www-style/2010Aug/0201.html
