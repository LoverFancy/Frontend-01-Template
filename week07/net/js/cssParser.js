const css = require('css');

const ID_SELECTOR = '#';
const CLASS_SELECTOR = '.';

const SELECTORDIRCTORY = {
  [ID_SELECTOR]: 'id',
  [CLASS_SELECTOR]: 'class'
}

module.exports = class CSSParser {

  constructor() {
    this.rules = [];
  }

  addCSSRules(text) {
    let ast = css.parse(text);
    this.rules.push(...ast.stylesheet.rules);
  }


  isMatch(element, selector, type) {
    const attr = element.attributes.filter(i => i.name === SELECTORDIRCTORY[type])[0];
    return attr && attr.value === selector.replace(type, '');
  }

  match(element, selector) {
    if(!element || !selector){
      return false
    }
    const selectorType = selector.charCodeAt(0);
    if (selectorType === ID_SELECTOR.charCodeAt(0)) {
      if(this.isMatch(element, selector, ID_SELECTOR)){
        return true
      }
    } else if (selectorType === CLASS_SELECTOR.charCodeAt(0)) {      
      if(this.isMatch(element, selector, CLASS_SELECTOR)){
        return true
      }
    }else {
      if(element.tagName === selector){
        return true
      }
    }
    return false
  }

  specificity(selector){
  // count 1 if the declaration is from is a 'style' attribute rather than a rule with a selector,
  // 0 otherwise (= a) (In HTML, values of an element's "style" attribute are style sheet rules.
  // These rules have no selectors, so a=1, b=0, c=0, and d=0.)
  // count the number of ID attributes in the selector (= b)
  // count the number of other attributes and pseudo-classes in the selector (= c)
  // count the number of element names and pseudo-elements in the selector (= d)
  // The specificity is based only on the form of the selector.
  // In particular,
  // a selector of the form "[id=p33]" is counted as an attribute selector (a=0, b=0, c=1, d=0),
  // even if the id attribute is defined as an "ID" in the source document's DTD.
  //
  // Concatenating the four numbers a-b-c-d (in a number system with a large base) gives the specificity.
    // const weights = [0, 0, 0, 0];
    let [ inlineStyle, idSelector, classOrAttributeOrPseudoClassSelector, tagOrPseudoElementSelector ] = [0, 0, 0, 0];
    const selectorParts = selector.split(' ').reverse();
    for(let part of selectorParts){
      if(part.charAt(0) === ID_SELECTOR){
        idSelector += 1;
      }else if (part.charAt(0) === CLASS_SELECTOR) {
        classOrAttributeOrPseudoClassSelector += 1;
      }else {
        tagOrPseudoElementSelector += 1;
      }
    }
    return [ inlineStyle, idSelector, classOrAttributeOrPseudoClassSelector, tagOrPseudoElementSelector ];
  }

  compare(first, second) {
    if(first[0] - second[0]){
      return first[0] - second[0];
    }
    if(first[1] - second[1]){
      return first[1] - second[1];
    }
    if(first[2] - second[2]){
      return first[2] - second[2];
    }
    return first[3] - second[3];
  }

  computeCSS(element, document) {
    const elements = document.slice().reverse();
    // reverse 是为了 能够从内向外匹配
    if(!element.computedStyle){
      element.computedStyle = {}
    }
    let matched = false;
    for (let rule of this.rules) {
      // 为了保持和 elements 顺序一致，所以进行reserve
      const selectorParts = rule.selectors[0].split(' ').reverse();
      if(this.match(element, selectorParts[0])) {
        let j = 1;
        for(let i = 0; i < elements.length; i++){          
          if(this.match(elements[i], selectorParts[j])){
            j++
          }
        }

        if(j >= selectorParts.length){
          matched = true;
        }

        if(matched) {
          // 匹配到
          const { computedStyle } = element;
          const weights = this.specificity(rule.selectors[0]);          
          for(let declaration of rule.declarations) {
            // init
            if(!computedStyle[declaration.property]){
              computedStyle[declaration.property] = {}
            }
            // specificity
            if(!computedStyle[declaration.property].specificity){
              computedStyle[declaration.property].value = declaration.value;
              computedStyle[declaration.property].specificity = weights;
            }else if (this.compare(computedStyle[declaration.property].specificity, weights) < 0) {
              computedStyle[declaration.property].value = declaration.value;
              computedStyle[declaration.property].specificity = weights;
            }
          }
        }
      }
    }
  }
}
