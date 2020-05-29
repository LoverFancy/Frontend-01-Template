class CssLayout {
  constructor() {
    this.flexSingleProperties = [
      'flex-direction', 'flex-wrap', 'justify-content', 'align-items', 'align-self',
      'align-content'
    ]

    this.flexSynthesisProperties = [
      'flex-flow',
    ]

    this.flexItems = [
      'order', 'flex-grow', 'flex-shrink', 'flex-basis'
    ]
    this.flexSynthesisItems = [
      'flex',
    ]

    this.initProperties = {
      'flex-direction': 'row',
      'flex-wrap': 'nowrap',
      'justify-content': 'flex-start',
      'align-items': 'stretch',
      'align-self': 'auto',
      'align-content': 'stretch',
    }

    this.initSynthesisProperties = {
      'flex-flow': [this.initProperties['flex-direction'], this.initProperties['flex-wrap']]
    }

    this.initItemsProperties = {
      'order': 0,
      'flex-grow': 0,
      'flex-shrink': 1,
      'flex-basis': 'auto'
    }

    this.initSynthesisItemsProperties = {
      'flex': [
        this.initItemsProperties['flex-grow'], this.initItemsProperties['flex-shrink'],
        this.initItemsProperties['flex-basis']
      ]
    }
  }



  calculationDirectionRule(style){
    // mainSize: 主轴排列时单行长度
    // mainStart: 主轴排列时排序方向
    // mainEnd: 主轴排列时排序方向
    // mainSign: 主轴排列时排序方向
    // mainBase: 主轴起点位置
    // crossSize: 交叉轴排列时单行长度
    // crossStart: 交叉轴排列时排序方向
    // crossEnd: 交叉轴排列时排序方向
    // crossSign: 交叉轴排列时排序方向
    // crossBase: 交叉轴起点位置
    return {
      'row': {
        mainSize: 'width',
        mainStart: 'left',
        mainEnd: 'right',
        mainSign: +1,
        mainBase: 0,
        crossSize: 'height',
        crossStart: 'top',
        crossEnd: 'bottom'
      },
      'row-reverse': {
        mainSize: 'width',
        mainStart: 'left',
        mainEnd: 'right',
        mainSign: -1,
        mainBase: style.width,
        crossSize: 'height',
        crossStart: 'top',
        crossEnd: 'bottom'
      },
      'column': {
        mainSize: 'height',
        mainStart: 'top',
        mainEnd: 'bottom',
        mainSign: +1,
        mainBase: 0,
        crossSize: 'width',
        crossStart: 'left',
        crossEnd: 'right'
      },
      'column-reverse': {
        mainSize: 'height',
        mainStart: 'top',
        mainEnd: 'bottom',
        mainSign: -1,
        mainBase: style.height,
        crossSize: 'width',
        crossStart: 'left',
        crossEnd: 'right'
      },
    }
  }

  calculationWarpRule(rule, wrapWay) {
    const { crossStart, crossEnd } = rule;
    if(wrapWay === 'wrap-reverse'){
      return {
        crossStart: crossEnd,
        crossEnd: crossStart,
        crossSign: -1,
      }
    }
    return {
      crossStart, crossEnd,
      crossBase: 0,
      crossSign: 1
    }
  }


  layout(element) {
    // computedStyle 不存在时不做处理
    if(!element.computedStyle){
      return;
    }
    // 获取当前元素的style
    const elementStyle = this.getStyle(element)
    // 判断 display 非 flex 类型的，不作处理
    if(elementStyle.display !== 'flex'){
      return void 0;
    }
    // 非 element 类型的元素不做处理
    const items = element.children.filter((i) => i.type === 'element');
    // 根据 order 进行元素的排序
    items.sort((a, b) => (a.order || 0) - (b.order || 0));
    const style = elementStyle;
    // // 对style中的宽高属性初始化 [height, witdh]
    this.initHeightAndWidth(style);
    // // // 对style中flex 相关属性进行初始化
    this.initFlexSingleProperties(style)
    // 根据flexDirection 确定数据处理相关的状态
    // 即根据排列方向 确定排列计算规则
    const rule = this.abstractCalculationRule(style);
    if(rule) {
      let {
        mainSize, mainStart, mainEnd, mainSign, mainBase, crossSize,
        crossStart, crossEnd, crossSign, crossBase
      } = rule;
      const isAutoSize = this.isAutoMainSize(style, rule);
      // 计算父级容器的主轴大小
      if(isAutoSize){
        this.initParentMainSize(style, items, rule);
      }

      const {
        flexLines, mainSpace
      } = this.spliteLines(style, items, rule, isAutoSize);
      this.getCurrentMain(flexLines, items, style, rule, mainSpace);
      this.getCrossSpace(style, flexLines, rule);
    }
  }

  getStyle(element){
    // 如果element 中 没有 style，则init 一个style
    if(!element.style){
      element.style = {};
    }
    // 将 computedStyle 中的属性 全部映射到 style中去
    for (let p in element.computedStyle) {
      element.style[p] = element.computedStyle[p].value;
      // 同时处理 px 和 数值字符串 转为 数值类型

      if(
        element.style[p].toString().match(/px$/) ||
        element.style[p].toString().match(/^[0-9\.]+$/)
      ){
        element.style[p] = parseInt(element.style[p])
      }
    }
    // 返回 style
    return element.style;
  }

  initHeightAndWidth(style) {
    ['height', 'witdh'].map((CSSProperties) => {
      if(['', 'auto'].includes(style[CSSProperties])){
        // 通过置为null,简化后续判断
        style[CSSProperties] = null;
      }
    })
  }

  initFlexSingleProperties(style){
    this.flexSingleProperties.map((i) => {
      if(!style[i] || style[i] === 'auto'){
        style[i] = this.initProperties[i];
      }
    })
  }

  abstractCalculationRule(style) {
    if(style['flex-direction']){
      const rule = this.calculationDirectionRule(style)[style['flex-direction']];
      const { crossStart, crossEnd, crossSign, crossBase } = this.calculationWarpRule(rule, style['flex-wrap'] || 'nowrap');
      return {
        ...rule,
        crossStart, crossEnd, crossSign, crossBase
      }
    }
    return void 0;
  }

  isAutoMainSize(style, rule) {
    // 判断当元素的父元素是否有设置宽度或者高度
    // 父级元素未设置width时
    if(!style[rule.mainSize]){
      return true;
    }
    return false
  }

  isNullOrUndefined(value) {
    return [null, void 0].includes(value)
  }

  initParentMainSize(style, items, rule) {
    const { mainSize } = rule;
    style[mainSize] = 0;
    // 如果没有设置父级元素的主轴
    // 通过所有子节点宽度撑开当前容器
    items.map((i) => {
      const itemStyle = this.getStyle(i);
      if(!this.isNullOrUndefined(itemStyle[mainSize])){
        style[mainSize] = style[mainSize] + itemStyle[mainSize];
      }
    })
  }

  getLocalLineCrossSpace(crossSpace, itemStyle, rule) {
    if(!this.isNullOrUndefined(itemStyle[rule.crossSize])){
      // 如果当前元素高度存在
      // 与当前行高进行比较
      // 行高由最大值撑起
      return Math.max(crossSpace, itemStyle[rule.crossSize]);
    }
    return crossSpace
  }

  getLineCrossSpace(style, flexLine, isAutoSize, rule, crossSpace) {
    const { crossSize } = rule;
    if(style['flex-wrap'] === 'nowrap' || isAutoSize) {
      flexLine.crossSpace = typeof style[crossSize] !== 'undefined' ? style[crossSize] : crossSpace;
    }else {
      flexLine.crossSpace = crossSpace
    }
  }

  // 计算每一行的元素、行高crossSpace
  spliteLines(style, items, rule, isAutoSize) {
    const {
      mainSize, mainStart, mainEnd, mainSign, mainBase, crossSize,
      crossStart, crossEnd, crossSign, crossBase
    } = rule;
    // 当前行元素
    let flexLine = [];
    // display 为 flex的元素下 的 所有元素
    const flexLines = [];
    // 当前主轴已排的元素的大小
    let mainSpace = style[mainSize];
    // 交叉轴一排元素的大小
    let crossSpace = 0;
    items.map((item, index) => {
      const itemStyle = this.getStyle(items[index]);
      // console.log(item, itemStyle);
      // 当前元素没有设置宽度，则宽度视为0,即忽律该元素
      if(this.isNullOrUndefined(itemStyle[mainSize])){
        itemStyle[mainSize] = 0;
      }
      // display 为 flex的父级容器 设置为不换行 且 宽度 为 auto 时,则即使 当前行大小不足，也要排列在同一行中
      if(style['flex-wrap'] === 'nowrap') {
        flexLine.push(item);
        if(!itemStyle.flex){
          mainSpace -= itemStyle[mainSize];
        }
        // 单行处理的入栈
        if((items.length - 1) === index){
          flexLines.push(flexLine);
        }
      }else {
        // 当前元素存在 flex 属性时，元素可伸缩，则当前行一定能放入该元素
        if(itemStyle.flex) {
          flexLine.push(item);
          mainSpace -= 0;
        }else {
          // 当前元素主轴大于父容器的主轴大小时
          if(itemStyle[mainSize] > style[mainSize]){
            itemStyle[mainSize] = style[mainSize]
          }
          // 剩余空间小于当前元素大小时
          if(mainSpace < itemStyle[mainSize]){
            // 保存当前行主轴剩余大小
            // 为后续弹性填充时，提供计算数据
            flexLine.mainSpace = mainSpace;
            // 保存当前行交叉轴大小
            flexLine.crossSpace = crossSpace;
            // 如果已存在元素
            if(flexLine.length > 0){
              // console.log(item.attributes[0].value, 'here');
              flexLines.push(flexLine);
            }
            mainSpace = style[mainSize];
            crossSpace = 0;
            flexLine = [item];
            // 如果另起一行后当前元素还是大于父容器主轴剩余大小
            // 则当前元素独占一行
            if(mainSpace <= itemStyle[mainSize] || (items.length - 1) === index){
              // 为后续弹性填充时，提供计算数据
              flexLine.mainSpace = 0;
              // 保存当前行交叉轴大小
              flexLine.crossSpace = crossSpace;
              flexLines.push(flexLine);
              flexLine = [];
            }
          }else {
            flexLine.push(item);
          }
          mainSpace -= itemStyle[mainSize];
        }
      }
      // 计算交叉轴大小
      crossSpace = this.getLocalLineCrossSpace(crossSpace, itemStyle, rule);

      if((items.length - 1) === index){
        // 当最后一个元素单独分行时
        // 保存当前行主轴剩余大小
        flexLine.mainSpace = mainSpace;
        // 保存当前行交叉轴的大小
        this.getLineCrossSpace(style, flexLine, isAutoSize, rule, crossSpace)
      }
    })
    return {
      flexLines, mainSpace
    }
  }

  getNoFlexibleCurrentAndStep(style, items, rule, mainSpace) {
    let step = 0;
    const { mainBase, mainSign } = rule;
    let currentMain = mainBase;
    if(style['justify-content'] === 'flex-end'){
      currentMain = mainSpace * mainSign + mainBase;
    }
    if(style['justify-content'] === 'center'){
      currentMain = mainSpace / 2 * mainSign + mainBase;
    }
    if(style['justify-content'] === 'space-between'){
      step = mainSpace / (items.length - 1) * mainSign;
    }

    if(style['justify-content'] === 'space-arround'){
      step = mainSpace / items.length * mainSign;
      currentMain = step / 2 + mainBase;
    }

    return {
      step, currentMain
    }
  }

  calculateItemSite({items, rule, mainSpace, flexTotal, step = 0, currentMain: currentMainSize, scale}) {
    const { mainSize, mainBase, mainStart, mainEnd, mainSign } = rule;
    let currentMain = currentMainSize || mainBase;
    items.map((i) => {
      const itemStyle = this.getStyle(i);
      if(scale){
        if(typeof itemStyle.flex !== 'undefined') {
          // TODO: 待验证
          itemStyle[mainSize] = itemStyle.flex * style[mainSize] * (-mainSpace / (style[mainSize] - mainSpace)) ;
        }else {
          // 当前元素宽度缩放
          itemStyle[mainSize] = itemStyle[mainSize] * scale;
        }
      }else {
        if(typeof itemStyle.flex !== 'undefined') {
          // TODO: 待验证
          itemStyle[mainSize] = itemStyle.flex * (mainSpace / flexTotal) ;
        }
      }

      // 确定左右坐标的位置
      itemStyle[mainStart] = currentMain;
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
      // 下一个元素的起点位置
      currentMain = itemStyle[mainEnd] + step;
    })
  }

  getCurrentMain(flexLines, items, style, rule, mainSpace) {
    const { mainSize, mainBase, mainStart, mainEnd } = rule;
    // mainSpace < 0 === flex.wrap = 'nowrap'
    if(mainSpace < 0){
      const scale = style[mainSize] / (style[mainSize] - mainSpace);
      this.calculateItemSite({ items, rule, mainSpace, scale })
    }else {
      // flex.wrap !== 'nowrap'
      flexLines.map((flexLine) => {
        let { mainSpace } = flexLine;
        let flexTotal = 0;


        flexLine.map((item) => {
          const itemStyle = this.getStyle(item);
          if(!this.isNullOrUndefined(itemStyle.flex)){
            flexTotal += itemStyle.flex;
            // continue;
          }
        })

        if(flexTotal) {
          // flexible items
          this.calculateItemSite({items: flexLine, rule, mainSpace, flexTotal});
        }else {
          // no flexible items
          const { step, currentMain } = this.getNoFlexibleCurrentAndStep(style, items, rule, mainSpace);
          this.calculateItemSite({items: flexLine, rule, mainSpace, flexTotal, step, currentMain})
        }
      })


    }
  }

  getCrossBaseAndStep(style, flexLines, rule, crossSpace) {
    let step = 0;
    const { crossSign, crossSize } = rule;
    let crossBase = 0;
    if(style['flex-wrap'] === 'wrap-reverse'){
      crossBase = style[crossSize];
    }

    if(style['align-content'] === 'flex-end'){
      currentBase += crossSign * crossSpace;
    }

    if(style['align-content'] === 'center'){
      currentBase += crossSpace / 2 * crossSign;
    }

    if(style['align-content'] === 'space-between'){
      step = crossSpace / (flexLines.length - 1);
    }

    if(style['align-content'] === 'space-arround'){
      step = crossSpace / flexLines.length;
      currentBase += step / 2 + crossSign;
    }

    return {
      step, crossBase
    }
  }

  calculateItemCrossSite(flexLines, style, crossSpace, crossBase, step, rule) {
    const { crossSize, crossStart, crossEnd, crossSign } = rule;
    const baseLineCrossSize = style['align-content'] === 'stretch' ? crossSpace / flexLines.length : 0;
    flexLines.map((flexLine) => {
      const lineCrossSize = baseLineCrossSize + flexLine.crossSpace;
      flexLine.map((item, index) => {
        const itemStyle = this.getStyle(item);
        const align = itemStyle['align-self'] || style['align-items'];
        if(itemStyle[crossSize] === null){
          itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0;
        }
        if(align === 'flex-start'){
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
        }


        if(align === 'flex-end'){
          itemStyle[crossStart] = crossBase + lineCrossSize * crossSign;
          itemStyle[crossEnd] = itemStyle[crossStart] - crossSign * itemStyle[crossSize];
        }

        if(align === 'center'){
          itemStyle[crossStart] = crossBase + (lineCrossSize - itemStyle[crossSize]) * crossSign / 2;
          itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];        }

        if(align === 'stretch'){
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] = crossBase + crossSign * (this.isNullOrUndefined(itemStyle[crossSize]) ? lineCrossSize : itemStyle[crossSize])
          itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
        }
      })
      crossBase += crossSign * (lineCrossSize + step)
    })
  }

  getCrossSpace(style, flexLines, rule) {
    let crossSpace;
    const { crossSize } = rule;
    if(!style[crossSize]) {
      // 父元素未设置 crossSize ，子元素撑开
      crossSpace = 0;
      style[crossSize] = 0;
      flexLines.map((flexLine) => {
        style[crossSize] = style[crossSize] + flexLine.crossSpace;
      })
    }else {
      crossSpace = style[crossSize];
      flexLines.map((flexLine) => {
        crossSpace -= flexLine.crossSpace;
      })
    }
    // 当flexLines存在时，每行高度
    let lineSize = style[crossSize] / flexLines.length;
    const { crossBase, step } = this.getCrossBaseAndStep(style, flexLines, rule, crossSpace)
    this.calculateItemCrossSite(flexLines, style, crossSpace, crossBase, step, rule)
  }

}

module.exports = CssLayout;
