const CSSwhat = require('css-what');
const { match } = require('./match.js');
// const jsdom = require('jsdom');
// const { JSDOM } = jsdom;

const ID_OR_CLASS = ['id', 'class'];

const uniqueSymbol = Symbol('uuid');

// pseudo element
const VAILD_PSEUDO_ELEMENT = ['first-line', 'first-letter', 'before', 'after'];

const TAG_A_VAILD_PSEUDO_ELEMENT = ['selection'];

// pseudo class

const NORMAL_VAILD_PSEUDO_CLASS = [
  // dynamic pseudo classes
  'hover', 'active', 'focus',
  // target pseudo class
  'target',
  // structural pseudo classes
  'root', 'first-child', 'last-child', 'first-of-type', 'last-of-type', 'only-child', 'only-of-type', 'empty'
];

// language pseudo class
const LANGUAGE_PSEUDO_CLASS = ['lang'];
// structural pseudo classes
const STRUCTURAL_PSEUDO_CLASSES = ['nth-child', 'nth-last-child', 'nth-of-type', 'nth-last-of-type'];

const NEGATION_PSEUDO_CLASS = ['not'];

const VAILD_PSEUDO_CLASS_FUNCTION = LANGUAGE_PSEUDO_CLASS.concat(STRUCTURAL_PSEUDO_CLASSES);

const TAG_A_VAILD_PSEUDO_CLASS = ['link', 'visited'];

const TAG_RADIO_AND_CHECKBOX_VAILD_PSEUDO_CLASS = ['checked', 'indeterminate'];

// functions deal with tag
function isTarget(element, tag) {
  return element.tagName.toLocaleLowerCase() === tag;
}

function getParentChildren(element) {
  if(element && element.parentElement){
    return element.parentElement.children;
  }
  return [];
}

function findElementIndex(element) {
  element.setAttribute(uniqueSymbol, 'true');
  const { children } = element.parentElement;
  let index = -1;
  for(let i = 0; i < children.length; i++){
    if(children[i].getAttributes(uniqueSymbol)){
      index = i;
      break;
    }
  }
  return index;
}

function findAncestor(element, tag) {
  let hasTargetAncestor = false;
  while (element.parentElement) {
    if(findParent(element, tag)){
      hasTargetAncestor = true;
      break;
    }else {
      element = element.parentElement;
    }
  }
  return hasTargetAncestor;
}

function findParent(element, tag) {
  const hasParent = isTarget(element.parentElement, tag);
  if(hasParent){
    element = element.parentElement;
  }
  return hasParent;
}

function findCloseBrother(element, tag) {
  const brothers = getParentChildren(element);
  const index = findElementIndex(element);
  return brothers[index - 1] && isTarget(brothers[index - 1], tag);
}

function findOlderBrother(element, tag) {
  const brothers = getParentChildren(element);
  const index = findElementIndex(element);
  let hasBrother = false;
  for(let i = index; i >= 0; i--){
    hasBrother = isTarget(brothers[i], tag);
    if(hasBrother){
      break;
    }
  }
  return hasBrother;
}

function isTagExist(element, tag, mode) {
  if(mode === 'closeBrother') {
    // 相邻兄弟选择器: Next-sibling combinator
    // value: "plus sign" (U+002B, +)
    return findCloseBrother(element, tag)
  }else if(mode === 'ancestor') {
    // 后代选择器: Descendant combinator
    // value: whitespace
    return findAncestor(element, tag);
  }else if (mode === 'parent') {
    // 子元素选择器: Child combinators
    // value: "greater-than sign" (U+003E, >)
    return findParent(element, tag);
  }else if (mode === 'olderBrother') {
    // 后继同胞选择器: subsequent-sibling combinator (弟弟选择器😜)
    // value: "tilde" (U+007E, ~)
    return findOlderBrother(element, tag);
  }
  // no combinators means
  return isTarget(element, tag);
}

// sycn update element's attribute
function updateAttributes(element) {
  return getAttributes(element);
}

// functions deal with pseudo element
function isVaildPseudoElement(element, selector) {
  // compatibility for a::selection
  let pseudoElementSet = VAILD_PSEUDO_ELEMENT;
  if(element.tagName.toLocaleLowerCase() === 'a') {
    pseudoElementSet = pseudoElementSet.concat(TAG_A_VAILD_PSEUDO_ELEMENT);
  }
  return pseudoElementSet.includes(selector.name);
}

// functions deal with pseudo element

// In CSS, identifiers (including element names, classes, and IDs in selectors)
// can contain only the characters [a-zA-Z0-9] and ISO 10646 characters U+00A0 and higher,
// plus the hyphen (-) and the underscore (_);
// they cannot start with a digit, two hyphens, or a hyphen followed by a digit.
// Identifiers can also contain escaped characters and any ISO 10646 character as a numeric code (see next item)
// In CSS 2.1, a backslash (\) character can indicate one of three types of character escape.
// Inside a CSS comment,
// a backslash stands for itself,
// and if a backslash is immediately followed by the end of the style sheet,
// it also stands for itself (i.e., a DELIM token)

// In CSS, identifiers (including element names, classes, and IDs in selectors)
// can contain only the characters [a-zA-Z0-9] and ISO 10646 characters U+00A0 and higher,
// plus the hyphen (-) and the underscore (_); they cannot start with a digit,
// two hyphens, or a hyphen followed by a digit.
// Identifiers can also contain escaped characters and any ISO 10646 character as a numeric code (see next item).
// For instance, the identifier "B&W?" may be written as "B\&W\?" or "B\26 W\3F"
function isIdentifiers(data) {
  // C must be a valid CSS identifier [CSS21]
  // and must not be empty.
  // (Otherwise, the selector is invalid.)
  if(data === null) {
    return false
  }
  // ident     [-]?{nmstart}{nmchar}*
  // name      {nmchar}+
  // nmstart   [_a-z]|{nonascii}|{escape}
  // nonascii  [^\0-\177]
  // unicode   \\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?
  // escape    {unicode}|\\[^\n\r\f0-9a-f]
  // nmchar    [_a-z0-9-]|{nonascii}|{escape}
  const nonascii = '[^\0-\177]';
  const unicode = '\\[0-9a-f]{1,6}(\r\n|[ \n\r\t\f])?';
  const escape = `${unicode}|\\[^\n\r\f0-9a-f]`;
  const nmstart = `[_a-z]|${nonascii}|${escape}`;
  const nmchar = `[_a-z0-9-]|${nonascii}|${escape}`;
  const ident = `[-]?${nmstart}${nmchar}*`;
  const dataVaildRegExp = new RegExp(ident);
  return dataVaildRegExp.test(data);
}
/**
BNF
nth
  : S* [ ['-'|'+']? INTEGER? {N} [ S* ['-'|'+'] S* INTEGER ]? |
         ['-'|'+']? INTEGER | {O}{D}{D} | {E}{V}{E}{N} ] S*
  ;
**/
function isVaildExpression(data) {
  return /^[\-|\+]?[0-9]?n([\-|\+][0-9])?$|^([\-|\+]?[0-9]$)|^odd$|^even$/.test(data.toLocaleLowerCase());
}

function isVaildPseudoClassFunctionData(selector) {
  const { name, data } = selector;
  return LANGUAGE_PSEUDO_CLASS.includes(name) ? isIdentifiers(data) : isVaildExpression(data);
}

function isVaildSelectorListArgument(data) {
  // CSSwhat.parse('a:not') -> data = null
  if(data === null){
    return false
  }
  // CSSwhat.parse('a:not()') -> data = [[]]
  if(data[0].length === 0){
    return false
  }
  return true
}
function isNestingNot(data) {
  return data[0][0].name === 'not' ? true : false
}

function isVaildNegationPseudoClass(selector) {
  const { data } = selector;
  if(isVaildSelectorListArgument(data)){
    // Negations may not be nested; :not(:not(...)) is invalid.
    if(isNestingNot(data)){
      return false;
    }
    // may be will support Selector list argument in future
    if(data.length === 1){
      // TODO: 逻辑不严谨
      // type selector：例如 div
      // universal selector：例如 *
      // attribute selector：例如 div[foo]
      // class selector：例如 .myclass
      // ID selector：例如 #myid
      // pseudo-class：例如 a:hover
      return true
    }
  }
  return false
}

function isVaildPseudoClass(element, selector) {
  const { name, data } = selector;
  if(VAILD_PSEUDO_CLASS_FUNCTION.includes(name)){
    if(!data) {
      return false
    }
    return isVaildPseudoClassFunctionData(selector);
  }else if (NEGATION_PSEUDO_CLASS.includes(name)) {
    if(!data) {
      return false
    }
    return isVaildNegationPseudoClass(selector);
  }else {
    if(data !== null) {
      return false
    }
    const tag = element.tagName.toLocaleLowerCase();
    let pseudoClassSet = NORMAL_VAILD_PSEUDO_CLASS;
    if(tag === 'a'){
      pseudoClassSet = pseudoClassSet.concat(TAG_A_VAILD_PSEUDO_CLASS);
    }else if(tag === 'input' && ['radio', 'checkbox'].includes(element.getAttribute('type'))){
      // checked     (checked)      #IMPLIED  -- for radio buttons and check boxes --
      pseudoClassSet = pseudoClassSet.concat(TAG_RADIO_AND_CHECKBOX_VAILD_PSEUDO_CLASS);
    }
    return pseudoClassSet.includes(name);
  }
}

// functions deal with Attribute selectors

// If an element has multiple ID attributes,
// all of them must be treated as IDs for that element for the purposes of the ID selector.
// 当前元素 attribute 中的 id 如果存在多个 id 值, 所有 id值 都必须视为该元素的id

const getIdSelectorValue = (v) => v === null ? [] : [v];

const getClassSelectorValue = (v) => v === null ? [] : v.split(' ');

const convert = {
  id: getIdSelectorValue,
  class: getClassSelectorValue
}

function getAttributes(element) {
  const names = element.getAttributeNames();
  if(names.length === 0) {
    return {};
  }
  const attributes = names
  .filter((i) => !ID_OR_CLASS.includes(i))
  .reduce((p, l) => {
    return p[l] = element.getAttribute(l), p;
  }, {});
  return ID_OR_CLASS.reduce((p, l) => {
    return p[l] = convert[l](element.getAttribute(l)), p;
  },
  attributes);
}

function matchHeaderAndNextWord(value, attribute) {
  if(attribute) {
    const { length } = value;
    const attributeHeader = attribute.slice(0, length);
    const attributeHeaderNextWord = attribute.slice(length, length+1);
    return value === attributeHeader && ['', ' ', '-'].includes(attributeHeaderNextWord);
  }
  return false;
}

function matchHeader(value, attribute, sign = true) {
  if(attribute) {
    const { length } = value;
    const attributeHeader = sign ? attribute.slice(0, length) : attribute.slice(-length);
    return value === attributeHeader;
  }
  return false;
}

function judgeAttribute(attributes, selector) {
  const { name, value } = selector;
  if(ID_OR_CLASS.includes(name)) {
    return attributes[name] && attributes[name].includes(value);
  }
  // Attribute presence and value selectors
  const { action } = selector;
  if(action === 'exists') {
    // 检查元素是否具有这个属性: [att]
    // Represents an element with the att attribute, whatever the value of the attribute.
    // 只要元素有这个属性，不论属性是什么值，都可以被选中
    return attributes.hasOwnProperty(name)
  }else if (action === 'equals') {
    // 精确匹配: [att=val]
    // Represents an element with the att attribute whose value is exactly "val".
    // 元素属性的值 === val
    return attributes[name] && attributes[name] === value;
  }else if (action === 'element') {
    // 多种匹配: [att~=val]
    // Represents an element with the att attribute whose value is a whitespace-separated list of words,
    // one of which is exactly "val".
    // If "val" contains whitespace, it will never represent anything (since the words are separated by spaces).
    // Also if "val" is the empty string, it will never represent anything.
    // 检查一个元素的值是否是 attributes[att] 中的若干值之一.值之间用 whitespace 分隔.
    // 如果 val 是空字符串,则 该条属性 无意义, 因为无法匹配任何东西
    if(value === ''){
      return false
    }else {
      return attributes[name] && attributes[name].split(' ').includes(value);
    }
  }else if (action === 'hyphen') {
    // 开头可选连字符匹配: [att|=val]
    // Represents an element with the att attribute,
    // its value either being exactly "val" or beginning with "val" immediately followed by "-" (U+002D).
    return matchHeaderAndNextWord(value, attributes[name]);
  }else if (action === 'start') {
    // Substring matching attribute selectors: []
    // 开头匹配: [att^=val]
    // Represents an element with the att attribute whose value begins with the prefix "val".
    // If "val" is the empty string then the selector does not represent anything.
    return matchHeader(value, attributes[name]);
  }else if (action === 'end') {
    // 结尾匹配: [att$=val]
    // Represents an element with the att attribute whose value ends with the suffix "val".
    // If "val" is the empty string then the selector does not represent anything.
    return matchHeader(value, attributes[name], false);
  }else if (action === 'any') {
    // [att*=val]
    // Represents an element with the att attribute whose value contains at least one instance of the substring "val".
    // If "val" is the empty string then the selector does not represent anything.
    // match function 是之前写的 基于 状态机的 匹配函数
    return attributes[name] && match(value, attributes[name]);
  }
  return false
}

// judge Condition
// css selector can apply into 的 target element
// so if selector rule has invalid pseudo-elements or pseudo-classes
// that means the local selector rule is invalid

function matchSelector(element, selector) {
  if(!element || !selector){
    return false
  }
  let isMatch = false;
  try {
    // split selector & match order by local element
    const allSelector = CSSwhat.parse(selector);
    // console.log('allSelector', JSON.stringify(allSelector));
    // init attributes by local element
    let attributes = updateAttributes(element);
    let searchMode;
    // console.log('attributes', attributes);
    for(let site = 0; site < allSelector.length; site++){

      let i = 0;
      const selector = allSelector[site].reverse();
      while(i < selector.length) {
        const { type } = selector[i];
        if(type === 'attribute') {
          isMatch = judgeAttribute(attributes, selector[i]);
        }else if(type === 'tag') {
          const { name } = selector[i];
          isMatch = isTagExist(element, name, searchMode);
          // 重置 搜索模式
          searchMode = void 0;
        }else if(type === 'adjacent') {
          // 相邻兄弟选择器: Next-sibling combinator
          // value: "plus sign" (U+002B, +)
          searchMode = 'closeBrother';
        }else if(type === 'descendant') {
          // 后代选择器: Descendant combinator
          // value: whitespace
          searchMode = 'ancestor';
        }else if (type === 'child') {
          // 子元素选择器: Child combinators
          // value: "greater-than sign" (U+003E, >)
          searchMode = 'parent';
        }else if (type === 'sibling') {
          // 后继同胞选择器: subsequent-sibling combinator (弟弟选择器😜)
          // value: "tilde" (U+007E, ~)
          searchMode = 'olderBrother';
        }else if (type === 'pseudo') {
          isMatch = isVaildPseudoClass(element, selector[i]);
        }else if (type === 'pseudo-element'){
          isMatch = isVaildPseudoElement(element, selector[i]);
        }else if(type === 'universal'){
          // * 通配选择器
          isMatch = true;
        }

        if(isMatch) {
          attributes = updateAttributes(element);
          i++;
        }else {
          break;
        }
      }

      if(isMatch){
          break;
      }
      updateAttributes(element);
      searchMode = void 0;
    }

    console.log('isMatch', isMatch);
    return isMatch;

  }catch(e){
    console.log('expeciton', e, 'isMatch', false);
    return false;
  }
}


// // base window
// const dom = new JSDOM(`
// <!DOCTYPE html>
// <html lang="en" dir="ltr">
//   <head>
//     <meta charset="utf-8">
//     <title></title>
//   </head>
//   <body>
//   </body>
// </html>`);
//
// const { document } = dom.window;
//
// const body = document.getElementsByTagName('body');
//
// const A = document.createElement('a');
// body[0].append(A);
// matchSelector(A, ':root()')


module.exports = {
  matchSelector
}
