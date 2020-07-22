// // 使用FSM 分析 HTML
// // 根据 https://html.spec.whatwg.org/multipage/parsing.html#data-state 提供的状态机描述文档 实现状态机
// // 选取部分 状态进行分析
//
// // const CSSParser = require('./cSSParser');
// // const CssLayout = require('./layout');
//
// const AMPERSAND = '\u0026'; // AMPERSAND (&)
// const LESS_THAN = '\u003C'; // LESS-THAN SIGN (<)
// const NULL = '\u0000'; // NULL ('')
// const EOF = Symbol('EOF'); // EOF: end of file
// const SOLIDUS = '\u002F'; // SOLIDUS (/)
// const GREATER_THAN = '\u003E'; // U+003E GREATER-THAN SIGN (>)
// const UNKHNOW_TOKEN = '\uFFFD'; // U+FFFD unkhnow token(�)
// const EQUALS = '\u003D'; // U+003D EQUALS SIGN (=)
// const QUOTATION = '\u0022'; // U+0022 QUOTATION (")
// const APOSTROPHE = '\u0027'; // U+0027 APOSTROPHE (')
// const EXCLAMATION = '\u0021'; // U+0021 EXCLAMATION MARK (!)
// // const QUESTION = '\u003F'; // U+003F QUESTION MARK (?)
// const GRAVE = '\u0060'; // U+0060 GRAVE ACCENT (`)
//
// let currentToken = {};
// let currentAttribute = {};
// let currentTextNode = null;
//
// let stack = [{
//   type: 'document',
//   children: []
// }];
//
// // const Css = new CSSParser();
// //
// // const Layout = new CssLayout();
//
// function emitToken(token) {
//
//   let top = stack[stack.length - 1];
//
//   if(token.type == 'startTag') {
//     let element = {
//       type: 'element',
//       children: [],
//       attributes: []
//     };
//
//     element.tagName = token.tagName;
//     for(let p in token) {
//       if(p !== 'type' && p !== 'tagName'){
//
//         element.attributes.push({
//           name: p,
//           value: token[p]
//         })
//       }
//     }
//     // console.log(element.attributes);
//
//     // Css.computeCSS(element, stack)
//
//     top.children.push(element);
//     // element.parent = top;
//
//     if(!token.isSelfClosing) {
//       stack.push(element);
//     }
//
//     currentTextNode = null
//
//   }else if (token.type === 'endTag') {
//       if(top.tagName !== token.tagName) {
//         throw new Error('tag start end does not match');
//       }else {
//         // add css attributes
//         if(top.tagName === 'style'){
//           // Css.addCSSRules(top.children[0].content);
//         }
//         stack.pop();
//       }
//       // Layout.layout(top);
//       currentTextNode = null
//   }else if (token.type === 'text') {
//       if(currentTextNode === null){
//         currentTextNode = {
//           type: 'text',
//           content: ''
//         }
//         top.children.push(currentTextNode)
//       }
//       currentTextNode.content += token.content;
//   }
// }
//
// function data(c) {
//   if(c === AMPERSAND){
//     // U+0026 AMPERSAND (&)
//     // Set the return state to the data state. Switch to the character reference state.
//     // return characterReferenceInData
//     emitToken({
//       type: 'text',
//       content: c
//     });
//     return data;
//   }else if (c === LESS_THAN) {
//     // U+003C LESS-THAN SIGN (<)
//     // Switch to the tag open state.
//     return tagOpen;
//   }else if (c === NULL) {
//     // U+0000 NULL
//     // This is an unexpected-null-character parse error.
//     // Emit the current input character as a character token.
//     emitToken({
//       type: 'text',
//       content: c
//     });
//     return data;
//   }else if (c === EOF){
//     // EOF
//     // Emit an end-of-file token.
//     emitToken({
//       type: 'EOF'
//     });
//     return ;
//   }else {
//     // Anything else
//     // Emit the current input character as a character token.
//     emitToken({
//       type: 'text',
//       content: c
//     });
//     return data;
//   }
// }
//
// function tagOpen(c) {
//   if(c === EXCLAMATION){
//     // U+0021 EXCLAMATION MARK (!)
//     // Switch to the markup declaration open state.
//     return ;
//   }else if (c === SOLIDUS){
//     // Switch to the end tag open state.
//     return endTagOpen;
//   }else if (c.match(/^[a-zA-Z]$/)) {
//     // ASCII alpha
//     // ASCII alpha is an ASCII upper alpha or ASCII lower alpha.
//     // ASCII upper alpha is a code point in the range U+0041 (A) to U+005A (Z), inclusive.
//     // ASCII lower alpha is a code point in the range U+0061 (a) to U+007A (z), inclusive.
//     // Create a new start tag token, set its tag name to the empty string.
//     // Reconsume in the tag name state.
//     currentToken = {
//       type: 'startTag',
//       tagName: ''
//     }
//     return tagName(c);
//   }
//   // else if(c === QUESTION) {
//   //   // U+003F QUESTION MARK (?)
//   //   // This is an unexpected-question-mark-instead-of-tag-name parse error.
//   //   // Create a comment token whose data is the empty string.
//   //   // Reconsume in the bogus comment state.
//   //   return tagOpen;
//   // }
//   else if (c === EOF) {
//     // EOF
//     // This is an eof-before-tag-name parse error.
//     // Emit a U+003C LESS-THAN SIGN character token and an end-of-file token.
//     emitToken({
//       type: 'EOF'
//     });
//     return ;
//   }else {
//     // Anything else
//     // This is an invalid-first-character-of-tag-name parse error.
//     // Emit a U+003C LESS-THAN SIGN character token.
//     // Reconsume in the data state.
//     emitToken({
//       type: 'text',
//       content: c
//     })
//     return data(c);
//   }
// }
//
// function endTagOpen(c) {
//   if(c.match(/^[a-zA-Z]$/)){
//     // ASCII alpha
//     // Create a new end tag token, set its tag name to the empty string.
//     // Reconsume in the tag name state.
//     currentToken = {
//       type: 'endTag',
//       tagName: ''
//     };
//     return tagName(c);
//   }else if (c === GREATER_THAN) {
//     // U+003E GREATER-THAN SIGN (>)
//     // This is a missing-end-tag-name parse error. Switch to the data state.
//     return data;
//   }else if(c === EOF){
//     // EOF
//     // This is an eof-before-tag-name parse error.
//     // Emit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS character token and an end-of-file token.
//     //
//     emitToken({
//       type: 'EOF'
//     });
//     return ;
//   }else {
//     // Anything else
//     // This is an invalid-first-character-of-tag-name parse error.
//     // Create a comment token whose data is the empty string.
//     // Reconsume in the bogus comment state.
//     return;
//   }
// }
//
// function tagName(c) {
//   if(c.match(/^[\t\n\f ]$/)){
//     // U+0009 CHARACTER TABULATION (tab)
//     // U+000A LINE FEED (LF)
//     // U+000C FORM FEED (FF)
//     // U+0020 SPACE
//     // Switch to the before attribute name state.
//     return beforeAttributeName;
//   }else if(c === SOLIDUS) {
//     // U+002F SOLIDUS (/)
//     // Switch to the self-closing start tag state.
//     return selfClosingStartTag;
//   }else if (c === GREATER_THAN) {
//     // U+003E GREATER-THAN SIGN (>)
//     // Switch to the data state. Emit the current tag token.
//     emitToken(currentToken);
//     return data;
//   }else if (c.match(/^[A-Z]$/)) {
//     // ASCII upper alpha
//     // Append the lowercase version of the current input character (add 0x0020 to the character's code point) to the current tag token's tag name.
//     return tagName(c.toLowerCase());
//   }else if (c === NULL) {
//     // U+0000 NULL
//     // This is an unexpected-null-character parse error.
//     // Append a U+FFFD REPLACEMENT CHARACTER character to the current tag token's tag name.
//     return tagName(UNKHNOW_TOKEN)
//   }else if(c === EOF){
//     // EOF
//     // This is an eof-in-tag parse error.
//     // Emit an end-of-file token.
//     emitToken({
//       type: 'EOF'
//     });
//     return ;
//   }else {
//     // Anything else
//     // Append the current input character to the current tag token's tag name.
//     currentToken.tagName += c;
//     return tagName
//   }
// }
//
// function beforeAttributeName(c) {
//   if(c.match(/^[\t\n\f ]$/)){
//     // U+0009 CHARACTER TABULATION (tab)
//     // U+000A LINE FEED (LF)
//     // U+000C FORM FEED (FF)
//     // U+0020 SPACE
//     // Ignore the character.
//     // So switch to the before attribute name state.
//     return beforeAttributeName;
//   }else if ([SOLIDUS, GREATER_THAN, EOF].includes(c)) {
//     return afterAttributeName(c);
//   }else if (c === EQUALS) {
//     // U+003D EQUALS SIGN (=)
//     // This is an unexpected-equals-sign-before-attribute-name parse error.
//     // Start a new attribute in the current tag token.
//     // Set that attribute's name to the current input character, and its value to the empty string.
//     currentAttribute.value = '';
//     // Switch to the attribute name state.
//     return beforeAttributeName
//   }else {
//     // Anything else
//     // Start a new attribute in the current tag token.
//     // Set that attribute name and value to the empty string.
//     currentAttribute = {
//       name: '',
//       value: ''
//     }
//     // Reconsume in the attribute name state.
//     return attributeName(c)
//   }
// }
//
// function afterAttributeName(c) {
//   if(c.match(/^[\t\n\f ]$/)){
//     // U+0009 CHARACTER TABULATION (tab)
//     // U+000A LINE FEED (LF)
//     // U+000C FORM FEED (FF)
//     // U+0020 SPACE
//     // Ignore the character.
//     // So switch to the after attribute name state.
//     return afterAttributeName;
//   }else if (c === SOLIDUS) {
//     // U+002F SOLIDUS (/)
//     // Switch to the self-closing start tag state.
//     return selfClosingStartTag;
//   }else if (c === EQUALS) {
//     // U+003D EQUALS SIGN (=)
//     // Switch to the before attribute value state.
//     return beforeAttributeValue
//   }else if (c === GREATER_THAN) {
//     // U+003E GREATER-THAN SIGN (>)
//     // Switch to the data state. Emit the current tag token.
//     emitToken(currentToken);
//     return data
//   }else if (c === EOF) {
//     // EOF
//     // This is an eof-in-tag parse error.
//     // Emit an end-of-file token.
//     emitToken({
//       type: 'EOF'
//     });
//     return ;
//   }else {
//     // Anything else
//     // Start a new attribute in the current tag token.
//     currentToken[currentAttribute.name] = currentAttribute.value;
//     // Set that attribute name and value to the empty string.
//     currentAttribute = {
//       name: '',
//       value: ''
//     }
//     // Reconsume in the attribute name state.
//     return attributeName(c)
//   }
// }
//
// function attributeName(c) {
//   if(c.match(/^[\t\n\f ]$/) || [SOLIDUS, GREATER_THAN, EOF].includes(c) ){
//     // U+0009 CHARACTER TABULATION (tab)
//     // U+000A LINE FEED (LF)
//     // U+000C FORM FEED (FF)
//     // U+0020 SPACE
//     // U+002F SOLIDUS (/)
//     // U+003E GREATER-THAN SIGN (>)
//     // EOF
//     // Reconsume in the after attribute name state.
//     return afterAttributeName(c);
//   }else if (c === EQUALS) {
//     // U+003D EQUALS SIGN (=)
//     // Switch to the before attribute value state.
//     return beforeAttributeValue;
//   }else if (c.match(/^[A-Z]$/)) {
//     // ASCII upper alpha
//     // Append the lowercase version of the current input character (add 0x0020 to the character's code point) to the current attribute's name.
//     return attributeName(c.toLowerCase());
//   }else if (c === NULL) {
//     // U+0000 NULL
//     // This is an unexpected-null-character parse error.
//     // Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's name.
//     currentAttribute.name += UNKHNOW_TOKEN;
//     return attributeName;
//   }else if([QUOTATION, APOSTROPHE, LESS_THAN].includes(c)) {
//     // U+0022 QUOTATION MARK (")
//     // U+0027 APOSTROPHE (')
//     // U+003C LESS-THAN SIGN (<)
//     // This is an unexpected-character-in-attribute-name parse error.
//     // Treat it as per the "anything else" entry below.
//     return attributeName;
//   }else {
//     // Anything else
//     // Append the current input character to the current attribute's name.
//     currentAttribute.name += c;
//     return attributeName;
//   }
// }
//
// function beforeAttributeValue(c) {
//   if(c.match(/^[\t\n\f ]$/)){
//     // U+0009 CHARACTER TABULATION (tab)
//     // U+000A LINE FEED (LF)
//     // U+000C FORM FEED (FF)
//     // U+0020 SPACE
//     // Ignore the character.
//     // So switch to the before attribute value state.
//     return beforeAttributeValue;
//   }else if (c === QUOTATION) {
//     // U+0022 QUOTATION MARK (")
//     // Switch to the attribute value (double-quoted) state.
//     return doubleQuotedAttributeValue;
//   }else if (c === APOSTROPHE) {
//     // U+0027 APOSTROPHE (')
//     // Switch to the attribute value (single-quoted) state.
//     return singleQuotedAttributeValue;
//   }else if (c === GREATER_THAN) {
//     // U+003E GREATER-THAN SIGN (>)
//     // This is a missing-attribute-value parse error.
//     // Switch to the data state.
//     // Emit the current tag token.
//     emitToken(currentToken);
//     return data;
//   }else {
//     // Anything else
//     // Reconsume in the attribute value (unquoted) state.
//     return unquotedAttributeValue(c);
//   }
// }
//
// function selfClosingStartTag(c) {
//   if(c === GREATER_THAN){
//     // U+003E GREATER-THAN SIGN (>)
//     // Set the self-closing flag of the current tag token.
//     // Switch to the data state.
//     // Emit the current tag token.
//     currentToken.isSelfClosing = true;
//     emitToken(currentToken);
//     return data;
//   }else if (c === EOF) {
//     // EOF
//     // This is an eof-in-tag parse error.
//     // Emit an end-of-file token.
//     emitToken({
//       type: 'EOF'
//     });
//     return;
//   }else {
//     // Anything else
//     // This is an unexpected-solidus-in-tag parse error.
//     // Reconsume in the before attribute name state.
//     return beforeAttributeName(c);
//   }
// }
// //问题1： 老师 在 5-attribute 的parser中，对应的逻辑和 whatwcg不一致？
// function afterQuotedAttributeValue(c) {
//   if(c.match(/^[\t\n\f ]$/)){
//     // U+0009 CHARACTER TABULATION (tab)
//     // U+000A LINE FEED (LF)
//     // U+000C FORM FEED (FF)
//     // U+0020 SPACE
//     // Switch to the before attribute name state.
//     return beforeAttributeName;
//   }else if (c === SOLIDUS) {
//     // U+002F SOLIDUS (/)
//     // Switch to the self-closing start tag state.
//     return selfClosingStartTag;
//   }else if (c === GREATER_THAN) {
//     // U+003E GREATER-THAN SIGN (>)
//     // Switch to the data state.
//     // Emit the current tag token.
//     emitToken(currentToken);
//     return data;
//   }else if(c === EOF){
//     // EOF
//     // This is an eof-in-tag parse error.
//     // Emit an end-of-file token.
//     emitToken({
//       type: 'EOF'
//     });
//     return ;
//   }else {
//     // Anything else
//     // This is a missing-whitespace-between-attributes parse error.
//     // Reconsume in the before attribute name state.
//     return beforeAttributeName(c);
//   }
// }
//
// function doubleQuotedAttributeValue(c) {
//   if(c === QUOTATION){
//     // U+0022 QUOTATION MARK (")
//     // Switch to the after attribute value (quoted) state.
//     currentToken[currentAttribute.name] = currentAttribute.value;
//     return afterQuotedAttributeValue;
//   }else if (c === AMPERSAND) {
//     // U+0026 AMPERSAND (&)
//     // Set the return state to the attribute value (double-quoted) state.
//     // Switch to the character reference state.
//     return ;
//   }else if (c === NULL) {
//     // U+0000 NULL
//     // This is an unexpected-null-character parse error.
//     // Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's value.
//     currentAttribute.value += UNKHNOW_TOKEN;
//   }else if (c === EOF) {
//     // EOF
//     // This is an eof-in-tag parse error.
//     // Emit an end-of-file token.
//     emitToken({
//       type: 'EOF'
//     });
//     return;
//   }else {
//     // Anything else
//     // Append the current input character to the current attribute's value.
//     currentAttribute.value += c;
//     return doubleQuotedAttributeValue;
//   }
// }
//
// function singleQuotedAttributeValue(c) {
//   if(c === APOSTROPHE){
//     // U+0027 APOSTROPHE MARK (')
//     // Switch to the after attribute value (quoted) state.
//     currentToken[currentAttribute.name] = currentAttribute.value;
//     return afterQuotedAttributeValue;
//   }else if (c === AMPERSAND) {
//     // U+0026 AMPERSAND (&)
//     // Set the return state to the attribute value (double-quoted) state.
//     // Switch to the character reference state.
//     return ;
//   }else if (c === NULL) {
//     // U+0000 NULL
//     // This is an unexpected-null-character parse error.
//     // Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's value.
//     currentAttribute.value += UNKHNOW_TOKEN;
//   }else if (c === EOF) {
//     // EOF
//     // This is an eof-in-tag parse error.
//     // Emit an end-of-file token.
//     emitToken({
//       type: 'EOF'
//     });
//     return;
//   }else {
//     // Anything else
//     // Append the current input character to the current attribute's value.
//     currentAttribute.value += c;
//     return singleQuotedAttributeValue
//   }
// }
//
// //问题2： 老师 在 unquotedAttributeValue 中，对应的逻辑和 whatwcg不一致？
// function unquotedAttributeValue(c) {
//   if(c.match(/^[\t\n\f ]$/)){
//     // U+0009 CHARACTER TABULATION (tab)
//     // U+000A LINE FEED (LF)
//     // U+000C FORM FEED (FF)
//     // U+0020 SPACE
//     // Switch to the before attribute name state.
//     currentToken[currentAttribute.name] = currentAttribute.value;
//     return beforeAttributeName;
//   }else if (c === AMPERSAND) {
//     // U+0026 AMPERSAND (&)
//     // Set the return state to the attribute value (unquoted) state.
//     // Switch to the character reference state.
//     return ;
//   }else if (c === GREATER_THAN) {
//     // U+003E GREATER-THAN SIGN (>)
//     // Switch to the data state.
//     // Emit the current tag token.
//     emitToken(currentToken);
//     return data;
//   }else if (c === NULL) {
//     // U+0000 NULL
//     // This is an unexpected-null-character parse error.
//     // Append a U+FFFD REPLACEMENT CHARACTER character to the current attribute's value.
//     currentAttribute.value += UNKHNOW_TOKEN;
//     return attributeName;
//   }else if([QUOTATION, APOSTROPHE, LESS_THAN, EQUALS, GRAVE].includes(c)) {
//     // U+0022 QUOTATION MARK (")
//     // U+0027 APOSTROPHE (')
//     // U+003C LESS-THAN SIGN (<)
//     // U+003D EQUALS SIGN (=)
//     // U+0060 GRAVE ACCENT (`)
//     // This is an unexpected-character-in-unquoted-attribute-value parse error.
//     // Treat it as per the "anything else" entry below.
//     return unquotedAttributeValue;
//   }else if(c === EOF){
//     // EOF
//     // This is an eof-in-tag parse error.
//     // Emit an end-of-file token.
//     emitToken({
//       type: 'EOF'
//     });
//     return ;
//   }else {
//     // Anything else
//     // Append the current input character to the current attribute's value.
//     currentAttribute.value += c;
//     return unquotedAttributeValue;
//   }
// }
//
// // script
// function scriptData(c) {
//   if(c === LESS_THAN){
//     return scriptDataLessThanSign;
//   }else {
//     emitToken({
//       type: 'text',
//       content: c
//     })
//     return scriptData
//   }
// }
//
// function scriptDataLessThanSign(c){
//     if(c === SOLIDUS) {
//         return scriptDataEndTagOpen;
//     } else {
//         emitToken({
//             type:"text",
//             content:"<"
//         });
//         emitToken({
//             type:"text",
//             content:c
//         });
//         return scriptData;
//     }
// }
// //in script received </
// function scriptDataEndTagOpen(c){
//     if(c == "s") {
//         return scriptDataEndTagNameS;
//     } else {
//         emitToken({
//             type:"text",
//             content:"</"
//         });
//
//         emitToken({
//             type:"text",
//             content:c
//         });
//         return scriptData;
//     }
// }
// function scriptDataEndTagNameS(c){
//     if(c == "c") {
//         return scriptDataEndTagNameC;
//     } else {
//         emitToken({
//             type:"text",
//             content:"</s"
//         });
//         emitToken({
//             type:"text",
//             content:c
//         });
//         return scriptData;
//     }
// }
//
//
//
// function scriptDataEndTagOpenC(c) {
//   if(c === 'r'){
//     return scriptDataEndTagOpenR;
//   }else {
//     emitToken({
//       type: 'text',
//       content: '<scr'
//     })
//     emitToken({
//       type: 'text',
//       content: c
//     })
//     return scriptData
//   }
// }
//
// function scriptDataEndTagOpenR(c) {
//   if(c === 'i'){
//     return scriptDataEndTagOpenI;
//   }else {
//     emitToken({
//       type: 'text',
//       content: '<scri'
//     })
//     emitToken({
//       type: 'text',
//       content: c
//     })
//     return scriptData
//   }
// }
//
// function scriptDataEndTagOpenI(c) {
//   if(c === 'p'){
//     return scriptDataEndTagOpenP;
//   }else {
//     emitToken({
//       type: 'text',
//       content: '<scrip'
//     })
//     emitToken({
//       type: 'text',
//       content: c
//     })
//     return scriptData
//   }
// }
//
// function scriptDataEndTagOpenP(c) {
//   if(c === 't'){
//     return scriptDataEndTag;
//   }else {
//     emitToken({
//       type: 'text',
//       content: '<script'
//     })
//     emitToken({
//       type: 'text',
//       content: c
//     })
//     return scriptData
//   }
// }
//
//
// function scriptDataEndTag(c) {
//   if(c === ' '){
//     return scriptDataEndTag;
//   }else if(c === GREATER_THAN) {
//     emitToken({
//       type: 'endTag',
//       tagName: 'script'
//     });
//     return data
//   }else {
//     emitToken({
//         type:"text",
//         content:"</script"
//     });
//     emitToken({
//         type:"text",
//         content:c
//     });
//     return scriptData
//   }
// }
//
// // 接受html作为参数，返回dom tree
// module.exports.parserHTML = function parserHTML(html) {
//   let state = data;
//   for (let c of html) {
//     state = state(c);
//     console.log('parserHTML', stack[stack.lenght - 1]);
//     if(stack[stack.lenght - 1].tagName === 'script' && state == data){
//       state = scriptData;
//     }
//   }
//   state = state(EOF);
//   return stack[0]
// }

let currentToken = null;
let currentAttribute = null;

let stack = [{type: "document", children:[]}];
let currentTextNode = null;

function emit(token){
    let top = stack[stack.length - 1];

    if(token.type == "startTag") {
        let element = {
            type: "element",
            children: [],
            attributes: []
        };

        element.tagName = token.tagName;

        for(let p in token) {
            if(p != "type" || p != "tagName")
                element.attributes.push({
                    name: p,
                    value: token[p]
                });
        }

        top.children.push(element);

        if(!token.isSelfClosing)
            stack.push(element);

        currentTextNode = null;

    } else if(token.type == "endTag") {
        if(top.tagName != token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            stack.pop();
        }
        currentTextNode = null;
    }  else if(token.type == "text") {
        if(currentTextNode == null) {
            currentTextNode = {
                type: "text",
                content: ""
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

const EOF = Symbol("EOF");


function data(c){
    if(c == "<") {
        return tagOpen;
    } else if( c == EOF) {
        emit({
            type:"EOF"
        });
        return ;
    } else {
        emit({
            type:"text",
            content:c
        });
        return data;
    }
}

function tagOpen(c){
    if(c == "/") {
        return endTagOpen;
    } else if(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "startTag",
            tagName : ""
        }
        return tagName(c);
    } else {
        emit({
            type: "text",
            content : c
        });
        return ;
    }
}

function tagName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c == "/") {
        return selfClosingStartTag;
    } else if(c.match(/^[A-Z]$/)) {
        currentToken.tagName += c//.toLowerCase();
        return tagName;
    } else if(c == ">") {
        emit(currentToken);
        return data;
    } else {
        currentToken.tagName += c;
        return tagName;
    }
}
function beforeAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c == "/" || c == ">" || c == EOF) {
        return afterAttributeName(c);
    } else if(c == "=") {

    } else {
        currentAttribute = {
            name: "",
            value: ""
        }
        //console.log("currentAttribute", currentAttribute)
        return attributeName(c);
    }
}

function attributeName(c) {
    //console.log(currentAttribute);
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
        return afterAttributeName(c);
    } else if(c == "=") {
        return beforeAttributeValue;
    } else if(c == "\u0000") {

    } else if(c == "\"" || c == "'" || c == "<") {

    } else {
        currentAttribute.name += c;
        return attributeName;
    }
}


function beforeAttributeValue(c) {
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF) {
        return beforeAttributeValue;
    } else if(c == "\"") {
        return doubleQuotedAttributeValue;
    } else if(c == "\'") {
        return singleQuotedAttributeValue;
    } else if(c == ">") {
        //return data;
    } else {
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c) {
    if(c == "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c == "\u0000") {

    } else if(c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue
    }
}


function singleQuotedAttributeValue(c) {
    if(c == "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if(c == "\u0000") {

    } else if(c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue
    }
}

function afterQuotedAttributeValue (c){
    if(c.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if(c == "/") {
        return selfClosingStartTag;
    } else if(c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c == EOF) {

    } else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue
    }
}


function UnquotedAttributeValue(c) {

    if(c.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if(c == "/") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if(c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c == "\u0000") {

    } else if(c == "\"" || c == "'" || c == "<" || c == "=" || c == "`") {

    } else if(c == EOF) {

    } else {
        currentAttribute.value += c;
        return UnquotedAttributeValue
    }
}

function selfClosingStartTag(c){
    if( c == ">") {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if(c == "EOF") {

    } else {

    }
}

function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "endTag",
            tagName : ""
        }
        return tagName(c);
    } else if(c == ">") {

    } else if(c == EOF) {

    } else {

    }
}
//in script
function scriptData(c){

    if(c == "<") {
        return scriptDataLessThanSign;
    } else {
        emit({
            type:"text",
            content:c
        });
        return scriptData;
    }
}
//in script received <
function scriptDataLessThanSign(c){
    if(c == "/") {
        return scriptDataEndTagOpen;
    } else {
        emit({
            type:"text",
            content:"<"
        });
        emit({
            type:"text",
            content:c
        });
        return scriptData;
    }
}
//in script received </
function scriptDataEndTagOpen(c){
    if(c == "s") {
        return scriptDataEndTagNameS;
    } else {
        emit({
            type:"text",
            content:"<"
        });

        emit({
            type:"text",
            content:"/"
        });

        emit({
            type:"text",
            content:"c"
        });
        return scriptData;
    }
}
//in script received </s
function scriptDataEndTagNameS(c){
    if(c == "c") {
        return scriptDataEndTagNameC;
    } else {
        emit({
            type:"text",
            content:"</s"
        });
        emit({
            type:"text",
            content:c
        });
        return scriptData;
    }
}

//in script received </sc
function scriptDataEndTagNameC(c){
    if(c == "r") {
        return scriptDataEndTagNameR;
    } else {
        emit({
            type:"text",
            content:"</sc"
        });
        emit({
            type:"text",
            content:c
        });
        return scriptData;
    }
}

//in script received </scr
function scriptDataEndTagNameR(c){
    if(c == "i") {
        return scriptDataEndTagNameI;
    } else {
        emit({
            type:"text",
            content:"</scr"
        });
        emit({
            type:"text",
            content:c
        });
        return scriptData;
    }
}
//in script received </scri
function scriptDataEndTagNameI(c){
    if(c == "p") {
        return scriptDataEndTagNameP;
    } else {
        emit({
            type:"text",
            content:"</scri"
        });
        emit({
            type:"text",
            content:c
        });
        return scriptData;
    }
}
//in script received </scrip
function scriptDataEndTagNameP(c){
    if(c == "t") {
        return scriptDataEndTag;
    } else {
        emit({
            type:"text",
            content:"</scrip"
        });
        emit({
            type:"text",
            content:c
        });
        return scriptData;
    }
}
//in script received </script
function scriptDataEndTag(c){
    if(c == " ") {
        return scriptDataEndTag;
    } if(c == ">") {
        emit({
            type: "endTag",
            tagName : "script"
        });
        return data;
    } else {
        emit({
            type:"text",
            content:"</script"
        });
        emit({
            type:"text",
            content:c
        });
        return scriptData;
    }
}

function afterAttributeName(c) {
    if(c.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if(c == "/") {
        return selfClosingStartTag;
    } else if(c == "=") {
        return beforeAttributeValue;
    } else if(c == ">") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if(c == EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name : "",
            value : ""
        };
        return attributeName(c);
    }
}

module.exports.parserHTML = function parserHTML(html){
    let state = data;
    for(let c of html) {
        state = state(c);
        console.log(stack[stack.length - 1]);
        if(stack[stack.length - 1].tagName === "script" && state == data) {
            state = scriptData;
        }
    }
    state = state(EOF);
    return stack[0];
}
