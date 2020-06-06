var expect = require("chai").expect;
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

describe("Result Failed Testing", function() {

  const A = document.createElement('a');
  const simpleSelectorWithTagName = 'a';
  // Groups of selectors
  it("element: <a/>, string: div, span, p", function() {
    expect(matchSelector(A, 'div, span, p')).to.be.equal(false);
  });
  // simple selector
  // tagName
  it("element: undefined, selector: a", function() {
    expect(matchSelector(void 0, simpleSelectorWithTagName)).to.be.equal(false);
  });
  it("element: <a />, string: undefined", function() {
    expect(matchSelector(A)).to.be.equal(false);
  });
  // id
  setAttributes(A, { id: 'id' })
  it("element: <a id='id'/>, string: #di", function() {
    expect(matchSelector(A, '#di')).to.be.equal(false);
  });
  // single class
  setAttributes(A, { class: 'd' });
  it("element: <a class='d'/>, string: .f", function() {
    expect(matchSelector(A, '.f')).to.be.equal(false);
  });

  // multiple classes
  setAttributes(A, { class: '' });
  setAttributes(A, { class: 'a b c' });
  it("element: <a class='a b c'/>, string: .d", function() {
    expect(matchSelector(A, '.d')).to.be.equal(false);
  });
  it("element: <a class='a b c'/>, string: .a.d", function() {
    expect(matchSelector(A, '.a.d')).to.be.equal(false);
  });
  it("element: <a class='a b c'/>, string: .a.b.d", function() {
    expect(matchSelector(A, '.a.b.d')).to.be.equal(false);
  });
  // Attribute
  setAttributes(A, { title: 'a' });
  it("element: <a title='a'/>, string: [tit]", function() {
    expect(matchSelector(A, '[tit]')).to.be.equal(false);
  });
  it("element: <a title='a'/>, string: [title=b]", function() {
    expect(matchSelector(A, '[title=b]')).to.be.equal(false);
  });
  setAttributes(A, { href: 'ab c' });
  it("element: <a href='a b c'/>, string: [href~=b]", function() {
    expect(matchSelector(A, '[href~=b]')).to.be.equal(false);
  });
  it("element: <a href='a b c'/>, string: [href|=a]", function() {
    expect(matchSelector(A, '[href|=a]')).to.be.equal(false);
  });
  setAttributes(A, { more: 'cd ab' });
  it("element: <a more='cd ab'/>, string: [more^=ab]", function() {
    expect(matchSelector(A, '[more^=ab]')).to.be.equal(false);
  });
  it("element: <a more='cd ab'/>, string: [more$=cd]", function() {
    expect(matchSelector(A, '[more$=cd]')).to.be.equal(false);
  });
  it("element: <a more='cd ab'/>, string: [more^=e]", function() {
    expect(matchSelector(A, '[more*=e]')).to.be.equal(false);
  });
  // Pseudo Class
  // language pseudo class
  it("element: <a/>, string: :lang", function() {
    expect(matchSelector(A, ':lang')).to.be.equal(false);
  });
  it("element: <a/>, string: a:lang()", function() {
    expect(matchSelector(A, 'a:lang()')).to.be.equal(false);
  });
  // structural pseudo classes
  it("element: <a/>, string: :root()", function() {
    expect(matchSelector(A, ':root()')).to.be.equal(false);
  });
  it("element: <a/>, string: a:nth-child(+3n-9n)", function() {
    expect(matchSelector(A, 'a:nth-child(+3n-9n)')).to.be.equal(false);
  });
  // negation pseudo class
  it("element: <a/>, string: :not(:not(a))", function() {
    expect(matchSelector(A, ':not(:not(a))')).to.be.equal(false);
  });
  it("element: <a/>, string: a:not", function() {
    expect(matchSelector(A, 'a:not')).to.be.equal(false);
  });
  it("element: <a/>, string: a:not()", function() {
    expect(matchSelector(A, 'a:not()')).to.be.equal(false);
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
  // Pseudo elements class
  it("element: <div/>, string: ::cc", function() {
    expect(matchSelector(Div, '::cc')).to.be.equal(false);
  });
  it("element: <div/>, string: ::selection", function() {
    expect(matchSelector(Div, '::selection')).to.be.equal(false);
  });
  // Combinators
  // Descendant combinator
  it("element: <div/>, string: div div div", function() {
    expect(matchSelector(ChildDiv, 'div div div')).to.be.equal(false);
  });
  it("element: <div/>, string: div div p", function() {
    expect(matchSelector(ChildDiv, 'div div p')).to.be.equal(false);
  });
  it("element: <div/>, string: p div", function() {
    expect(matchSelector(ChildDiv, 'p div')).to.be.equal(false);
  });
  const ChildChildDiv = document.createElement('div');
  setAttributes(ChildChildDiv, { title: 'a b c', ssr: 'ssr' });
  ChildP.appendChild(ChildChildDiv);
  it("element: <div/>, string: div p *[href]", function() {
    expect(matchSelector(ChildChildDiv, 'div p *[href]')).to.be.equal(false);
  });
  it("element: <div/>, string: div p *[title='abc']", function() {
    expect(matchSelector(ChildChildDiv, "div p *[title='abc']")).to.be.equal(false);
  });
  // Child combinators
  it("element: <div/>, string: body > p", function() {
    expect(matchSelector(Div, "body > p")).to.be.equal(false);
  });
  const ChildChildA = document.createElement('a');
  ChildDiv.appendChild(ChildChildA);
  it("element: <div/>, string: body div > div", function() {
    expect(matchSelector(ChildChildA, "body div > div p")).to.be.equal(false);
  });
  // Sibling combinators
  const ChildChildSpan = document.createElement('span');
  setAttributes(ChildChildA, { class: 'childchildP' });
  ChildDiv.appendChild(ChildChildSpan);
  // Next-sibling combinator
  it("element: <span />, string: .childchilda + span", function() {
    expect(matchSelector(ChildChildSpan, ".childchilda + span")).to.be.equal(false);
  });
  // Subsequent-sibling combinator
  const ChildChildP = document.createElement('p');
  setAttributes(ChildChildA, { class: 'childchildA' });
  ChildDiv.insertBefore(ChildChildP, ChildChildA);
  it("element: <span />, string: p.childchilda ~ span", function() {
    expect(matchSelector(ChildChildSpan, "p.childchilda ~ span")).to.be.equal(false);
  });
  it("element: <span />, string: h1 ~ span", function() {
    expect(matchSelector(ChildChildSpan, "h1 ~ span")).to.be.equal(false);
  });
});
