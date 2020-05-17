var match = require("../index.js").match;
var expect = require("chai").expect;

describe("test match", () => {
  it("has import match", () => {
    expect(match).to.be.a("function");
  });
});
// test match abababx
describe("Result Success Testing", function() {
  // Test single char pattern
  it(`pattern: ${Lamda}, string: ${twoByte}`, function() {
    expect(match(Lamda, twoByte)).to.be.equal(true);
  });
});
