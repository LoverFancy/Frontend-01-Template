// 使用FSM 分析 HTML
// 根据 https://html.spec.whatwg.org/multipage/parsing.html#data-state 提供的状态机描述文档 实现状态机
// 选取部分 状态进行分析

const CSSParser = require('./cSSParser');
const CssLayout = require('./layout');

const AMPERSAND = '\u0026'; // AMPERSAND (&)
const LESS_THAN = '\u003C'; // LESS-THAN SIGN (<)
const NULL = '\u0000'; // NULL ('')
const EOF = Symbol('EOF'); // EOF: end of file
const SOLIDUS = '\u002F'; // SOLIDUS (/)
const GREATER_THAN = '\u003E'; // U+003E GREATER-THAN SIGN (>)
const UNKHNOW_TOKEN = '\uFFFD'; // U+FFFD unkhnow token(�)
const EQUALS = '\u003D'; // U+003D EQUALS SIGN (=)
const QUOTATION = '\u0022'; // U+0022 QUOTATION (")
const APOSTROPHE = '\u0027'; // U+0027 APOSTROPHE (')
const EXCLAMATION = '\u0021'; // U+0021 EXCLAMATION MARK (!)
// const QUESTION = '\u003F'; // U+003F QUESTION MARK (?)
const GRAVE = '\u0060'; // U+0060 GRAVE ACCENT (`)

let currentToken = {};
let currentAttribute = {};
let currentTextNode = null;

let stack = [{
  type: 'document',
  children: []
}];

const Css = new CSSParser();

const Layout = new CssLayout();

function emitToken(token) {

  let top = stack[stack.length - 1];

  if(token.type == 'startTag') {
    let element = {
      type: 'element',
      children: [],
      attributes: []
    };

    element.tagName = token.tagName;
    for(let p in token) {
      if(p !== 'type' && p !== 'tagName'){

        element.attributes.push({
          name: p,
          value: token[p]
        })
      }
    }
    console.log(element.attributes);

    Css.computeCSS(element, stack)

    top.children.push(element);
    // element.parent = top;

    if(!token.isSelfClosing) {
      stack.push(element);
    }

    currentTextNode = null

  }else if (token.type === 'endTag') {
      if(top.tagName !== token.tagName) {
        throw new Error('tag start end does not match');
      }else {
        // add css attributes
        if(top.tagName === 'style'){
          Css.addCSSRules(top.children[0].content);
        }
        stack.pop();
      }
      Layout.layout(top);
      currentTextNode = null
  }else if (token.type === 'text') {
      if(currentTextNode === null){
        currentTextNode = {
          type: 'text',
          content: ''
        }
        top.children.push(currentTextNode)
      }
      currentTextNode.content += token.content;
  }
}

function data(c) {
  if(c === AMPERSAND){
    // U+0026 AMPERSAND (&)
    // Set the return state to the data state. Switch to the character reference state.
    // return characterReferenceInData
    emitToken({
      type: 'text',
      content: c
    });
    return data;
  }else if (c === LESS_THAN) {
    // U+003C LESS-THAN SIGN (<)
    // Switch to the tag open state.
    return tagOpen;
  }else if (c === NULL) {
    // U+0000 NULL
    // This is an unexpected-null-character parse error.
    // Emit the current input character as a character token.
    emitToken({
      type: 'text',
      content: c
    });
    return data;
  }else if (c === EOF){
    // EOF
    // Emit an end-of-file token.
    emitToken({
      type: 'EOF'
    });
    return ;
  }else {
    // Anything else
    // Emit the current input character as a character token.
    emitToken({
      type: 'text',
      content: c
    });
    return data;
  }
}

function tagOpen(c) {
  if(c === EXCLAMATION){
    // U+0021 EXCLAMATION MARK (!)
    // Switch to the markup declaration open state.
    return ;
  }else if (c === SOLIDUS){
    // Switch to the end tag open state.
    return endTagOpen;
  }else if (c.match(/^[a-zA-Z]$/)) {
    // ASCII alpha
    // ASCII alpha is an ASCII upper alpha or ASCII lower alpha.
    // ASCII upper alpha is a code point in the range U+0041 (A) to U+005A (Z), inclusive.
    // ASCII lower alpha is a code point in the range U+0061 (a) to U+007A (z), inclusive.
    // Create a new start tag token, set its tag name to the empty string.
    // Reconsume in the tag name state.
    currentToken = {
      type: 'startTag',
      tagName: ''
    }
    return tagName(c);
  }
  // else if(c === QUESTION) {
  //   // U+003F QUESTION MARK (?)
  //   // This is an unexpected-question-mark-instead-of-tag-name parse error.
  //   // Create a comment token whose data is the empty string.
  //   // Reconsume in the bogus comment state.
  //   return tagOpen;
  // }
  else if (c === EOF) {
    // EOF
    // This is an eof-before-tag-name parse error.
    // Emit a U+003C LESS-THAN SIGN character token and an end-of-file token.
    emitToken({
      type: 'EOF'
    });
    return ;
  }else {
    // Anything else
    // This is an invalid-first-character-of-tag-name parse error.
    // Emit a U+003C LESS-THAN SIGN character token.
    // Reconsume in the data state.
    emitToken({
      type: 'text',
      content: c
    })
    return data(c);
  }
}

function endTagOpen(c) {
  if(c.match(/^[a-zA-Z]$/)){
    // ASCII alpha
    // Create a new end tag token, set its tag name to the empty string.
    // Reconsume in the tag name state.
    currentToken = {
      type: 'endTag',
      tagName: ''
    };
    return tagName(c);
  }else if (c === GREATER_THAN) {
    // U+003E GREATER-THAN SIGN (>)
    // This is a missing-end-tag-name parse error. Switch to the data state.
    return data;
  }else if(c === EOF){
    // EOF
    // This is an eof-before-tag-name parse error.
    // Emit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS character token and an end-of-file token.
    //
    emitToken({
      type: 'EOF'
    });
    return ;
  }else {
    // Anything else
    // This is an invalid-first-character-of-tag-name parse error.
    // Create a comment token whose data is the empty string.
    // Reconsume in the bogus comment state.
    return;
  }
}

function tagName(c) {
  if(c.match(/^[\t\n\f ]$/)){
    // U+0009 CHARACTER TABULATION (tab)
    // U+000A LINE FEED (LF)
    // U+000C FORM FEED (FF)
    // U+0020 SPACE
    // Switch to the before attribute name state.
    return beforeAttributeName;
  }else if(c === SOLIDUS) {
    // U+002F SOLIDUS (/)
    // Switch to the self-closing start tag state.
    return selfClosingStartTag;
  }else if (c === GREATER_THAN) {
    // U+003E GREATER-THAN SIGN (>)
    // Switch to the data state. Emit the current tag token.
    emitToken(currentToken);
    return data;
  }else if (c.match(/^[A-Z]$/)) {
    // ASCII upper alpha
    // Append the lowercase version of the current input character (add 0x0020 to the character's code point) to the current tag token's tag name.
    return tagName(c.toLowerCase());
  }else if (c === NULL) {
    // U+0000 NULL
    // This is an unexpected-null-character parse error.
    // Append a U+FFFD REPLACEMENT CHARACTER character to the current tag token's tag name.
    return tagName(UNKHNOW_TOKEN)
  }else if(c === EOF){
    // EOF
    // This is an eof-in-tag parse error.
    // Emit an end-of-file token.
    emitToken({
      type: 'EOF'
    });
    return ;
  }else {
    // Anything else
    // Append the current input character to the current tag token's tag name.
    currentToken.tagName += c;
    return tagName
  }
}

function beforeAttributeName(c) {
  if(c.match(/^[\t\n\f ]$/)){
    // U+0009 CHARACTER TABULATION (tab)
    // U+000A LINE FEED (LF)
    // U+000C FORM FEED (FF)
    // U+0020 SPACE
    // Ignore the character.
    // So switch to the before attribute name state.
    return beforeAttributeName;
  }else if ([SOLIDUS, GREATER_THAN, EOF].includes(c)) {
    return afterAttributeName(c);
  }else if (c === EQUALS) {
    // U+003D EQUALS SIGN (=)
    // This is an unexpected-equals-sign-before-attribute-name parse error.
    // Start a new attribute in the current tag token.
    // Set that attribute's name to the current input character, and its value to the empty string.
    currentAttribute.value = '';
    // Switch to the attribute name state.
    return beforeAttributeName
  }else {
    // Anything else
    // Start a new attribute in the current tag token.
    // Set that attribute name and value to the empty string.
    currentAttribute = {
      name: '',
      value: ''
    }
    // Reconsume in the attribute name state.
    return attributeName(c)
  }
}

function afterAttributeName(c) {
  if(c.match(/^[\t\n\f ]$/)){
    // U+0009 CHARACTER TABULATION (tab)
    // U+000A LINE FEED (LF)
    // U+000C FORM FEED (FF)
    // U+0020 SPACE
    // Ignore the character.
    // So switch to the after attribute name state.
    return afterAttributeName;
  }else if (c === SOLIDUS) {
    // U+002F SOLIDUS (/)
    // Switch to the self-closing start tag state.
    return selfClosingStartTag;
  }else if (c === EQUALS) {
    // U+003D EQUALS SIGN (=)
    // Switch to the before attribute value state.
    return beforeAttributeValue
  }else if (c === GREATER_THAN) {
    // U+003E GREATER-THAN SIGN (>)
    // Switch to the data state. Emit the current tag token.
    emitToken(currentToken);
    return data
  }else if (c === EOF) {
    // EOF
    // This is an eof-in-tag parse error.
    // Emit an end-of-file token.
    emitToken({
      type: 'EOF'
    });
    return ;
  }else {
    // Anything else
    // Start a new attribute in the current tag token.
    currentToken[currentAttribute.name] = currentAttribute.value;
    // Set that attribute name and value to the empty string.
    currentAttribute = {
      name: '',
      value: ''
    }
    // Reconsume in the attribute name state.
    return attributeName(c)
  }
}

function attributeName(c) {
  if(c.match(/^[\t\n\f ]$/) || [SOLIDUS, GREATER_THAN, EOF].includes(c) ){
    // U+0009 CHARACTER TABULATION (tab)
    // U+000A LINE FEED (LF)
    // U+000C FORM FEED (FF)
    // U+0020 SPACE
    // U+002F SOLIDUS (/)
    // U+003E GREATER-THAN SIGN (>)
    // EOF
    // Reconsume in the after attribute name state.
    return afterAttributeName(c);
  }else if (c === EQUALS) {
    // U+003D EQUALS SIGN (=)
    // Switch to the before attribute value state.
    return beforeAttributeValue;
  }else if (c.match(/^[A-Z]$/)) {
    // ASCII upper alpha
    // Append the lowercase version of the current input character (add 0x0020 to the character's code point) to the current attribute's name.
    return attributeName(c.toLowerCase());
  }else if (c === NULL) {
    // U+0000 NULL
    // This is an unexpected-null-character parse error.
    // Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's name.
    currentAttribute.name += UNKHNOW_TOKEN;
    return attributeName;
  }else if([QUOTATION, APOSTROPHE, LESS_THAN].includes(c)) {
    // U+0022 QUOTATION MARK (")
    // U+0027 APOSTROPHE (')
    // U+003C LESS-THAN SIGN (<)
    // This is an unexpected-character-in-attribute-name parse error.
    // Treat it as per the "anything else" entry below.
    return attributeName;
  }else {
    // Anything else
    // Append the current input character to the current attribute's name.
    currentAttribute.name += c;
    return attributeName;
  }
}

function beforeAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/)){
    // U+0009 CHARACTER TABULATION (tab)
    // U+000A LINE FEED (LF)
    // U+000C FORM FEED (FF)
    // U+0020 SPACE
    // Ignore the character.
    // So switch to the before attribute value state.
    return beforeAttributeValue;
  }else if (c === QUOTATION) {
    // U+0022 QUOTATION MARK (")
    // Switch to the attribute value (double-quoted) state.
    return doubleQuotedAttributeValue;
  }else if (c === APOSTROPHE) {
    // U+0027 APOSTROPHE (')
    // Switch to the attribute value (single-quoted) state.
    return singleQuotedAttributeValue;
  }else if (c === GREATER_THAN) {
    // U+003E GREATER-THAN SIGN (>)
    // This is a missing-attribute-value parse error.
    // Switch to the data state.
    // Emit the current tag token.
    emitToken(currentToken);
    return data;
  }else {
    // Anything else
    // Reconsume in the attribute value (unquoted) state.
    return unquotedAttributeValue(c);
  }
}

function selfClosingStartTag(c) {
  if(c === GREATER_THAN){
    // U+003E GREATER-THAN SIGN (>)
    // Set the self-closing flag of the current tag token.
    // Switch to the data state.
    // Emit the current tag token.
    currentToken.isSelfClosing = true;
    emitToken(currentToken);
    return data;
  }else if (c === EOF) {
    // EOF
    // This is an eof-in-tag parse error.
    // Emit an end-of-file token.
    emitToken({
      type: 'EOF'
    });
    return;
  }else {
    // Anything else
    // This is an unexpected-solidus-in-tag parse error.
    // Reconsume in the before attribute name state.
    return beforeAttributeName(c);
  }
}
//问题1： 老师 在 5-attribute 的parser中，对应的逻辑和 whatwcg不一致？
function afterQuotedAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/)){
    // U+0009 CHARACTER TABULATION (tab)
    // U+000A LINE FEED (LF)
    // U+000C FORM FEED (FF)
    // U+0020 SPACE
    // Switch to the before attribute name state.
    return beforeAttributeName;
  }else if (c === SOLIDUS) {
    // U+002F SOLIDUS (/)
    // Switch to the self-closing start tag state.
    return selfClosingStartTag;
  }else if (c === GREATER_THAN) {
    // U+003E GREATER-THAN SIGN (>)
    // Switch to the data state.
    // Emit the current tag token.
    emitToken(currentToken);
    return data;
  }else if(c === EOF){
    // EOF
    // This is an eof-in-tag parse error.
    // Emit an end-of-file token.
    emitToken({
      type: 'EOF'
    });
    return ;
  }else {
    // Anything else
    // This is a missing-whitespace-between-attributes parse error.
    // Reconsume in the before attribute name state.
    return beforeAttributeName(c);
  }
}

function doubleQuotedAttributeValue(c) {
  if(c === QUOTATION){
    // U+0022 QUOTATION MARK (")
    // Switch to the after attribute value (quoted) state.
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  }else if (c === AMPERSAND) {
    // U+0026 AMPERSAND (&)
    // Set the return state to the attribute value (double-quoted) state.
    // Switch to the character reference state.
    return ;
  }else if (c === NULL) {
    // U+0000 NULL
    // This is an unexpected-null-character parse error.
    // Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's value.
    currentAttribute.value += UNKHNOW_TOKEN;
  }else if (c === EOF) {
    // EOF
    // This is an eof-in-tag parse error.
    // Emit an end-of-file token.
    emitToken({
      type: 'EOF'
    });
    return;
  }else {
    // Anything else
    // Append the current input character to the current attribute's value.
    currentAttribute.value += c;
    return doubleQuotedAttributeValue;
  }
}

function singleQuotedAttributeValue(c) {
  if(c === APOSTROPHE){
    // U+0027 APOSTROPHE MARK (')
    // Switch to the after attribute value (quoted) state.
    currentToken[currentAttribute.name] = currentAttribute.value;
    return afterQuotedAttributeValue;
  }else if (c === AMPERSAND) {
    // U+0026 AMPERSAND (&)
    // Set the return state to the attribute value (double-quoted) state.
    // Switch to the character reference state.
    return ;
  }else if (c === NULL) {
    // U+0000 NULL
    // This is an unexpected-null-character parse error.
    // Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's value.
    currentAttribute.value += UNKHNOW_TOKEN;
  }else if (c === EOF) {
    // EOF
    // This is an eof-in-tag parse error.
    // Emit an end-of-file token.
    emitToken({
      type: 'EOF'
    });
    return;
  }else {
    // Anything else
    // Append the current input character to the current attribute's value.
    currentAttribute.value += c;
    return singleQuotedAttributeValue
  }
}

//问题2： 老师 在 unquotedAttributeValue 中，对应的逻辑和 whatwcg不一致？
function unquotedAttributeValue(c) {
  if(c.match(/^[\t\n\f ]$/)){
    // U+0009 CHARACTER TABULATION (tab)
    // U+000A LINE FEED (LF)
    // U+000C FORM FEED (FF)
    // U+0020 SPACE
    // Switch to the before attribute name state.
    currentToken[currentAttribute.name] = currentAttribute.value;
    return beforeAttributeName;
  }else if (c === AMPERSAND) {
    // U+0026 AMPERSAND (&)
    // Set the return state to the attribute value (unquoted) state.
    // Switch to the character reference state.
    return ;
  }else if (c === GREATER_THAN) {
    // U+003E GREATER-THAN SIGN (>)
    // Switch to the data state.
    // Emit the current tag token.
    emitToken(currentToken);
    return data;
  }else if (c === NULL) {
    // U+0000 NULL
    // This is an unexpected-null-character parse error.
    // Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's value.
    currentAttribute.value += UNKHNOW_TOKEN;
    return attributeName;
  }else if([QUOTATION, APOSTROPHE, LESS_THAN, EQUALS, GRAVE].includes(c)) {
    // U+0022 QUOTATION MARK (")
    // U+0027 APOSTROPHE (')
    // U+003C LESS-THAN SIGN (<)
    // U+003D EQUALS SIGN (=)
    // U+0060 GRAVE ACCENT (`)
    // This is an unexpected-character-in-unquoted-attribute-value parse error.
    // Treat it as per the "anything else" entry below.
    return unquotedAttributeValue;
  }else if(c === EOF){
    // EOF
    // This is an eof-in-tag parse error.
    // Emit an end-of-file token.
    emitToken({
      type: 'EOF'
    });
    return ;
  }else {
    // Anything else
    // Append the current input character to the current attribute's value.
    currentAttribute.value += c;
    return unquotedAttributeValue;
  }
}

// 接受html作为参数，返回dom tree
module.exports.parserHTML = function parserHTML(html) {
  let state = data;
  for (let c of html) {
    state = state(c);
  }
  state = state(EOF);
  return stack[0]
}
