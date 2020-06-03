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

});
