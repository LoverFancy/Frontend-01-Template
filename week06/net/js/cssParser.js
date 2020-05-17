const css = require('css');

const rules = [];

function addCSSRules(text) {
  let ast = css.parser(text);
  rules.push(...ast.stylesheet.rules)
}

function match() {

}

function computeCSS(element, document) {
  const elements = stack.slice().reverse();
  // reverse 是为了 能够从内向外匹配
  if(!element.computedStyle){
    element.computedStyle = {}
  }
  let mathced = false;
  for (let rule of rules) {
    const selectorParts = rule.selectors[0].split('').reverse();

    if(match(element, selectorParts[0])) {
      let j = 1;
      for(let i = 0; i < elements.length; i++){
        if(match(elements[i], selectorParts[j])){
          j++
        }

        if(j >= selectorParts.length){
          mathced = true;
        }

        if(matched) {
          // 匹配到
        }

      }
    }
  }
}

class CSSParser {

}
