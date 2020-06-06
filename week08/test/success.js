const { expect } = require("chai");
const { matchSelector } = require("../matchSelector.js");
const { setAttributes } = require("../util.js");
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

describe("test matchSelector", () => {
  it("has import matchSelector", () => {
    expect(matchSelector).to.be.a("function");
  });
});

// base window
const dom = new JSDOM(`
<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <title></title>
  </head>
  <body>
  </body>
</html>`);

const { document } = dom.window;

const body = document.getElementsByTagName('body');

describe("Result Success Testing", function() {
  const A = document.createElement('a');
  const simpleSelectorWithTagName = 'a';
  body[0].append(A);
  // Groups of selectors
  it("element: <a/>, string: div, span, a", function() {
    expect(matchSelector(A, 'div, span, a')).to.be.equal(true);
  });
  // simple selector
  // tagName
  it("element: <a />, selector: a", function() {
    expect(matchSelector(A, simpleSelectorWithTagName)).to.be.equal(true);
  });
  // universal
  it("element: <a />, selector: *", function() {
    expect(matchSelector(A, simpleSelectorWithTagName)).to.be.equal(true);
  });
  // id
  setAttributes(A, { id: 'id' })
  it("element: <a id='id'/>, string: #id", function() {
    expect(matchSelector(A, '#id')).to.be.equal(true);
  });
  // single class
  setAttributes(A, { class: 'c' })
  it("element: <a class='c'/>, string: .c", function() {
    expect(matchSelector(A, '.c')).to.be.equal(true);
  });
  // multiple classes
  setAttributes(A, { class: 'a b c' });
  it("element: <a class='c'/>, string: .a", function() {
    expect(matchSelector(A, '.a')).to.be.equal(true);
  });
  it("element: <a class='c'/>, string: .a.b", function() {
    expect(matchSelector(A, '.a.b')).to.be.equal(true);
  });
  it("element: <a class='c'/>, string: .a.b.c", function() {
    expect(matchSelector(A, '.a.b.c')).to.be.equal(true);
  });
  // Attribute
  setAttributes(A, { title: 'a' });
  it("element: <a title='a'/>, string: [title]", function() {
    expect(matchSelector(A, '[title]')).to.be.equal(true);
  });
  it("element: <a title='a'/>, string: [title=a]", function() {
    expect(matchSelector(A, '[title=a]')).to.be.equal(true);
  });
  setAttributes(A, { href: 'a b c' });
  it("element: <a href='a b c'/>, string: [href~=b]", function() {
    expect(matchSelector(A, '[href~=b]')).to.be.equal(true);
  });
  it("element: <a href='a b c'/>, string: [href|=a]", function() {
    expect(matchSelector(A, '[href|=a]')).to.be.equal(true);
  });
  setAttributes(A, { more: 'ab cd' });
  it("element: <a more='ab cd'/>, string: [more^=ab]", function() {
    expect(matchSelector(A, '[more^=ab]')).to.be.equal(true);
  });
  it("element: <a more='ab cd'/>, string: [more$=cd]", function() {
    expect(matchSelector(A, '[more$=cd]')).to.be.equal(true);
  });
  it("element: <a more='ab cd'/>, string: [more^=b]", function() {
    expect(matchSelector(A, '[more*=b]')).to.be.equal(true);
  });
  // Pseudo Class
  // language pseudo class
  it("element: <a/>, string: :lang(cn)", function() {
    expect(matchSelector(A, ':lang(cn)')).to.be.equal(true);
  });
  it("element: <a/>, string: a:lang(cn)", function() {
    expect(matchSelector(A, 'a:lang(cn)')).to.be.equal(true);
  });
  // structural pseudo classes
  it("element: <a/>, string: :root", function() {
    expect(matchSelector(A, ':root')).to.be.equal(true);
  });
  it("element: <a/>, string: a:root", function() {
    expect(matchSelector(A, 'a:root')).to.be.equal(true);
  });
  it("element: <a/>, string: a:nth-child(+3n-0)", function() {
    expect(matchSelector(A, 'a:nth-child(+3n-0)')).to.be.equal(true);
  });
  // negation pseudo class
  it("element: <a/>, string: :not(.disabled)", function() {
    expect(matchSelector(A, ':not(.disabled)')).to.be.equal(true);
  });
  // Pseudo elements class
  it("element: <a/>, string: ::after", function() {
    expect(matchSelector(A, '::after')).to.be.equal(true);
  });
  it("element: <a/>, string: ::selection", function() {
    expect(matchSelector(A, '::selection')).to.be.equal(true);
  });
  // prepear
  const Div = document.createElement('div');
  const ChildDiv = document.createElement('div');
  const ChildSpan = document.createElement('span');
  const ChildP = document.createElement('p');
  Div.appendChild(ChildDiv);
  Div.appendChild(ChildSpan);
  Div.appendChild(ChildP);
  body[0].append(Div);
  // Combinators
  // Descendant combinator
  it("element: <div/>, string: div div", function() {
    expect(matchSelector(ChildDiv, 'div div')).to.be.equal(true);
  });
  it("element: <span/>, string: body div span", function() {
    expect(matchSelector(ChildSpan, 'body div span')).to.be.equal(true);
  });
  it("element: <p/>, string: body * p", function() {
    expect(matchSelector(ChildP, 'body * p')).to.be.equal(true);
  });
  const ChildChildDiv = document.createElement('div');
  setAttributes(ChildChildDiv, { title: 'abc', href: '' });
  ChildP.appendChild(ChildChildDiv);
  it("element: <div/>, string: div p *[href]", function() {
    expect(matchSelector(ChildChildDiv, 'div p *[href]')).to.be.equal(true);
  });
  it("element: <div/>, string: div p *[title='abc']", function() {
    expect(matchSelector(ChildChildDiv, "div p *[title='abc']")).to.be.equal(true);
  });
  // Child combinators
  it("element: <div/>, string: body > div", function() {
    expect(matchSelector(Div, "body > div")).to.be.equal(true);
  });
  const ChildChildA = document.createElement('a');
  ChildDiv.appendChild(ChildChildA);
  it("element: <div/>, string: body div > div a", function() {
    expect(matchSelector(ChildChildA, "body div > div a")).to.be.equal(true);
  });
  // Sibling combinators
  const ChildChildSpan = document.createElement('span');
  setAttributes(ChildChildA, { class: 'childchilda' });
  ChildDiv.appendChild(ChildChildSpan);
  // Next-sibling combinator
  it("element: <span />, string: .childchilda + span", function() {
    expect(matchSelector(ChildChildSpan, ".childchilda + span")).to.be.equal(true);
  });
  // Subsequent-sibling combinator
  const ChildChildP = document.createElement('p');
  ChildDiv.insertBefore(ChildChildP, ChildChildA);
  it("element: <span />, string: .childchilda ~ span", function() {
    expect(matchSelector(ChildChildSpan, ".childchilda ~ span")).to.be.equal(true);
  });
  it("element: <span />, string: a ~ span", function() {
    expect(matchSelector(ChildChildSpan, "a ~ span")).to.be.equal(true);
  });
  it("element: <span />, string: p ~ span", function() {
    expect(matchSelector(ChildChildSpan, "p ~ span")).to.be.equal(true);
  });
});
