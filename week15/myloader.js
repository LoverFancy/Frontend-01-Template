var parser = require('./parser.js')

module.exports = function (source, map) {
  console.log('source', source);
  let tree = parser.parserHTML(source);
  console.log('parser', tree);
  console.log(this.resourcePath);
  let template = null;
  let script = null
  for(let node of tree.children){
    if (node.tagName === 'template') {
      console.log('node.children', node.children);
      template = node.children.filter(i => i.type !== 'text')[0]
    }
    if(node.tagName === 'script'){
      script = node.children[0].content
    }
  }
  let createCode = '';

  let visit = (node, depth) => {
    if (node.type === 'text') {
      return JSON.stringify(node.content);
    }
    let attrs = {};
    for (let attribute of node.attributes) {
      attrs[attribute.name] = attribute.value;
    }
    let children = node.children.map(n => visit(n))
    return `createElement("${node.tagName}", ${JSON.stringify(attrs)}, ${children})`
  }
  console.log(template);

  let result = `
  import {
    createElement, Pure, Wraper
  } from './pure';

  export class Carousel extends Pure {

    render() {
      console.log(this)
      return ${visit(template)};
    }

    mountTo(parent) {
      this.render().mountTo(parent)
    }

  }
  `;

  console.log(result);

  return result;
}
