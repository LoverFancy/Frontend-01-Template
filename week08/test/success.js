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
  // simple selector
  const A = document.createElement('a');
  const simpleSelectorWithTagName = 'a';
  body[0].append(A);
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
});
