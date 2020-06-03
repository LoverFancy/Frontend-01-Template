# 第八周总结

### Selector

> https://drafts.csswg.org/selectors-3/

#### Simple Selector

* type selector: 类型选择器
  * html standard 中的可用值([从whatwg上spider了一波](https://html.spec.whatwg.org/multipage/semantics.html#semantics))
```javascript
const allElements = [
"base",
"link",
"meta",
"noscript",
"script","style","template","title","a","abbr","address",
"area","article","aside","audio","b","bdi","bdo",
"blockquote","br","button","canvas","cite","code",
"data","datalist","del","details","dfn","dialog","div",
"dl","em","embed","fieldset","figure","footer","form","h1","h2","h3",
"h4","h5","h6","header","hgroup","hr","i","iframe","img","input","ins",
"kbd","label","main","map","mark","math","menu","meter","nav",
"object","ol","output","p","picture","pre","progress","q","ruby",
"s","samp","section","select","slot",
"small","span","strong","sub","sup","SVG","table","textarea",
"time","u","ul","var","video","wbr","autonomous","text" ]
```
  * css selector level 3 中则确定，只要满足以下 BNF 即可
```code
ident     [-]?{nmstart}{nmchar}*;
nmstart   [_a-z]|{nonascii}|{escape}
nonascii  [^\0-\177]
unicode   \\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?
escape    {unicode}|\\[^\n\r\f0-9a-f]
nmchar    [_a-z0-9-]|{nonascii}|{escape}
element_name = ident;
namespace_prefix = [ ident | '*' ]? '|';
type_selector = [ namespace_prefix ]? element_name;
```

* universal selector: 通配选择器
  * 不参与cascade的选择

* attribute selector: 属性选择器
* class selector: 类选择器
* id selector: id选择器
  * class id 可以看做是 属性选择器 中单独提供的两个快捷 interface
* pseudo-class: 伪类选择器

#### Pseudo Selector
* pseudo
  * pseudo-class
    * Dynamic pseudo-classes
    * Link pseudo-classes
    * User action pseudo-classes
    * The target pseudo-classes
      * 有些 URI 的最后以 # (number sign) 结尾，后面会跟着 anchor identifier (也称为 fragment identifier)，表明该 URI 是指向资源中的某个位置. 如果 fragment identifier 的 URL 会 link 到文件中的某些元素，则该元素被称为 target 元素
    * UI element states pseudo-classes
      * 表现 UI状态的 伪类
    * Structural pseudo-classes
      * 表现文档结构的类
    * The negation pseudo-class
      *  是一個函数型的伪类，可將一个 simple selector (不包括 :not(X) 本身) 作为参数。:not(X) 代表不選擇 match 到 X simple selector 的元素
  * pseudo-element

> css level 1 和 2中 伪类 和 伪元素 都是以 single colons (:) 开始

### 排版
* 将盒收集进入行
* 计算盒在行中间的排布方式
* 计算行的排布

#### 盒
  * 排版和渲染的基本单位是盒

##### 盒模型(box model)
* margin: 留白
* border-box
* padding
* content-box

> css 提供了接口可以调整width的计算方式 -> box-sizing

#### 正常流
  * 行模型
    * vertical align: 推荐使用 top、bottom、middle

> getClientRects: 获取当前元素产生的盒子

#### float

### BFC
  * Floats, absolutely positioned elements, block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes, and block boxes with 'overflow' other than 'visible' (except when that value has been propagated to the viewport) establish new block formatting contexts for their contents.
  * inline-block:可以当两部分看，对外面的它的兄弟节点来说，他是一个inline元素，对它包含的元素来说，他是一个可以包含block的container，建立BFC
#### block container
A block container box either contains only block-level boxes or establishes an inline formatting context and thus contains only inline-level boxes.
* Example: block 、inline-block

#### block level box
Block-level boxes are boxes that participate in a block formatting context.
* Example: flex、table、grid、block

#### block box
Block-level boxes that are also block containers are called block boxes.
* Example: block

> * block-level 表示可以被放入 BFC
> * block-container 表示可以容纳 BFC
> * block-box 表示里外都是 block
> * block-box = block-level + block-container
> * block-box 如果 overflow 是 visible， 那么就跟父bfc合并
