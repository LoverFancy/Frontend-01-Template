import {
  parserHTML
} from '../src/parser';
import assert from 'assert';

// @ts-ignore
it('parse a single element', function () {
  let dom = parserHTML('<div></div>');
  let div = dom.children[0];
  assert.equal(div.tagName, 'div');
  assert.equal(div.children.length, 0);
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 2);
});

// @ts-ignore
it('parse a single element with text context', function () {
  let dom = parserHTML('<div>123</div>');
  let text = dom.children[0].children[0];
  assert.equal(text.content, '123');
  assert.equal(text.type, 'text');
});

// @ts-ignore
it('tag mismatch', function () {
  try {
    let dom = parserHTML("<div></vid>");
  }catch(e) {
    assert.equal(e.message, "Tag start end doesn't match!");
  }
});

// @ts-ignore
it('test <', function () {
  let dom = parserHTML("<div>a < b</div>");
  let text = dom.children[0].children[0];
  assert.equal(text.content, 'a < b');
  assert.equal(text.type, 'text');
});

// @ts-ignore
it('with single quoted property', function () {
  let dom = parserHTML("<div id=a class='cls' data=\'abc\'></div>");
  let div = dom.children[0];
  let count = 0;
  for(let attr of div.attributes) {
    if(attr.name === 'id') {
      count++;
      assert.equal(attr.value, "a");
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, "cls");
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, "abc");
    }
  }
  assert.ok(count === 3);
});
// @ts-ignore
it('with double quoted property', function () {
  let dom = parserHTML("<div id=a class='cls' data=\"abc\"></div>");
  let div = dom.children[0];
  let count = 0;
  for(let attr of div.attributes) {
    if(attr.name === 'id') {
      count++;
      assert.equal(attr.value, "a");
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, "cls");
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, "abc");
    }
  }
  assert.ok(count === 3);
});

// @ts-ignore
it('self closing Tag', function () {
  let dom = parserHTML("<DIV/>");
  let div = dom.children[0];
  assert.equal(div.tagName, 'DIV');
  assert.equal(div.children.length, 0);
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 3);
});

// @ts-ignore
it('HT or LF or FF', function () {
  let dom = parserHTML(`<div id
  =a
  class=
  "cls"
  />
  `);
  let div = dom.children[0];
  assert.equal(div.tagName, 'div');
  assert.equal(div.children.length, 0);
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 5);
});

// @ts-ignore
it('HT or LF or FF', function () {
  let dom = parserHTML(`<div id="a"/>`);
  let div = dom.children[0];
  assert.equal(div.tagName, 'div');
  assert.equal(div.children.length, 0);
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 4);
});

// @ts-ignore
it('script', function () {
  let content = `<div>1</div>
    <span>abc</span>
    /script>
    <script
    </sc
    </scr
    </scri
    </scrip
    </script   
    <script
    `;
  let dom = parserHTML(`<script>${content}< /script>`);
  let text = dom.children[0].children[0];
  assert.equal(text.content, content);
  assert.equal(text.type, "text");
});

// @ts-ignore
it('attribute with no value', function () {
  let dom = parserHTML(`<div class id></div>`);
  let div = dom.children[0];
  assert.equal(div.tagName, 'div');
  assert.equal(div.children.length, 0);
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 4);
});

// @ts-ignore
it('missing-end-tag-name parse error', function () {
  let dom = parserHTML(`<div></>div>`);
  let div = dom.children[0];
  assert.equal(div.tagName, 'div');
  assert.equal(div.children.length, 1);
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 2);
});

// @ts-ignore
it('missing-end-tag-name parse error', function () {
  let dom = parserHTML(`<div></+div>`);
  let div = dom.children[0];
  assert.equal(div.tagName, 'div');
  assert.equal(div.children.length, 0);
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 2);
});

// @ts-ignore
it('self closing mix some attribute after /', function () {
  let dom = parserHTML(`<div/ name>`);
  let div = dom.children[0];
  assert.equal(div.tagName, 'div');
  assert.equal(div.children.length, 0);
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 3);
});
// @ts-ignore
it('self closing mix some attribute after /', function () {
  let dom = parserHTML("<div data=\'abc\'a />");
  let div = dom.children[0];
  assert.equal(div.tagName, 'div');
  assert.equal(div.children.length, 0);
  assert.equal(div.type, 'element');
  assert.equal(div.attributes.length, 4);
});
// @ts-ignore
it('empty tagname element', function () {
  let dom = parserHTML('</>');
  let div = dom.children[0];
  assert.equal(div, void 0);
});
// // @ts-ignore
// describe('8', function () {
//   // @ts-ignore
//   it('on attribute value', function () {
//     // @ts-ignore
//     let dom = parserHTML(`
//     <div data />
//       `);
//   });
// });

// // @ts-ignore
// describe('9', function () {
//   // @ts-ignore
//   it('on attribute value', function () {
//     // @ts-ignore
//     let dom = parserHTML(`
//     <div data id />
//       `);
//   });
// });

// // @ts-ignore
// describe('10', function () {
//   // @ts-ignore
//   it('on attribute value', function () {
//     // @ts-ignore
//     let dom = parserHTML(`
//     <div/>
//       `);
//   });
// });

// // @ts-ignore
// describe('11', function () {
//   // @ts-ignore
//   it('on attribute value', function () {
//     // @ts-ignore
//     let dom = parserHTML(`
//     <script> <   /script>
//       `);
//   });
// });

// // @ts-ignore
// describe('11', function () {
//   // @ts-ignore
//   it('on attribute value', function () {
//     // @ts-ignore
//     let dom = parserHTML(`
//     <div>    </div>
//       `);
//   });
// });