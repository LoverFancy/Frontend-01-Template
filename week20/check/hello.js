// @ts-nocheck
// console.log('Hello, world!');
// phantom.exit();

var page = require('webpage').create();
page.open('http://localhost:8080', function (status) {
// page.open('http://localhost:9000', function (status) {
  console.log("Status: " + status);
  if (status === "success") {
    var body = page.evaluate(function () {
      var toString = function(pad, element) {
        var children = element.childNodes;
        var childrenString = '';
        for (var i = 0; i < children.length; i++) {
          childrenString += toString("  " + pad, children[i]) + (children.length === i+1 ? "" : "\n");
        }
        var name;
        if(element.nodeType === Node.TEXT_NODE) {
          name = "#text" + JSON.stringify(element.textContent);
        }
        if(element.nodeType === Node.ELEMENT_NODE) {
          name = element.tagName
        }
        return pad + name + (children.length ? "\n" + childrenString : "");
      }
      return toString('', document.body);
    });
    console.log('Page title is ' + body);
  }
  phantom.exit();
});