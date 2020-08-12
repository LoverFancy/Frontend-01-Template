import assert from 'assert';
import {
  add
} from '../src/add.js'
// @ts-ignore
describe('Array', function () {
  // @ts-ignore
  describe('#indexOf()', function () {
    // @ts-ignore
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('add', function () {
  // @ts-ignore
  it('should return -1 when the value is not present', function () {
    assert.equal(add(3,4), 7);
  });
});
