// var set = new Set();
// var objects = [
//     eval,
//     isFinite,
//     isNaN,
//     parseFloat,
//     parseInt,
//     decodeURI,
//     decodeURIComponent,
//     encodeURI,
//     encodeURIComponent,
//     Array,
//     Date,
//     RegExp,
//     Promise,
//     Proxy,
//     Map,
//     WeakMap,
//     Set,
//     WeakSet,
//     Function,
//     Boolean,
//     String,
//     Number,
//     Symbol,
//     Object,
//     Error,
//     EvalError,
//     RangeError,
//     ReferenceError,
//     SyntaxError,
//     TypeError,
//     URIError,
//     ArrayBuffer,
//     SharedArrayBuffer,
//     DataView,
//     Float32Array,
//     Float64Array,
//     Int8Array,
//     Int16Array,
//     Int32Array,
//     Uint8Array,
//     Uint16Array,
//     Uint32Array,
//     Uint8ClampedArray,
//     Atomics,
//     JSON,
//     Math,
//     Reflect];
//  深度优先
// objects.forEach(o => set.add(o));
// for(var i = 0; i < objects.length; i++) {
//     var o = objects[i]
//     for(var p of Object.getOwnPropertyNames(o)) {
//         var d = Object.getOwnPropertyDescriptor(o, p)
//         if( (d.value !== null && typeof d.value === "object") || (typeof d.value === "function"))
//             if(!set.has(d.value))
//                 set.add(d.value), objects.push(d.value);
//         if( d.get )
//             if(!set.has(d.get))
//                 set.add(d.get), objects.push(d.get);
//         if( d.set )
//             if(!set.has(d.set))
//                 set.add(d.set), objects.push(d.set);
//     }
// }
//
var set = new Set();
var globalProperties = [
    'eval',
    'isFinite',
    'isNaN',
    'parseFloat',
    'parseInt',
    'decodeURI',
    'decodeURIComponent',
    'encodeURI',
    'encodeURIComponent',
    'Array',
    'Date',
    'RegExp',
    'Promise',
    'Proxy',
    'Map',
    'WeakMap',
    'Set',
    'WeakSet',
    'Function',
    'Boolean',
    'String',
    'Number',
    'Symbol',
    'Object',
    'Error',
    'EvalError',
    'RangeError',
    'ReferenceError',
    'SyntaxError',
    'TypeError',
    'URIError',
    'ArrayBuffer',
    'SharedArrayBuffer',
    'DataView',
    'Float32Array',
    'Float64Array',
    'Int8Array',
    'Int16Array',
    'Int32Array',
    'Uint8Array',
    'Uint16Array',
    'Uint32Array',
    'Uint8ClampedArray',
    'Atomics',
    'JSON',
    'Math',
    'Reflect'
  ];

var quene = [];
for(var p of globalProperties){
  quene.push({
    path: [p],
    object: this[p]
  })
}
let current;
while (quene.length) {
  current = quene.shift();
  if(!set.has(current.object)){
    set.add(current.object);
    for(let p of Object.getOwnPropertyNames(current!.object)){
      var property = Object.getOwnPropertyDescriptor(current!.object, p);
      if(
        property.hasOwnproperty('value') && ((property.value !== null &&
          typeof property.value === 'object') || typeof property.value === 'object'
        ) && property.value instanceof Object
      ){
        quene.push({
          path: current.path.concat([p]),
          object: property.value
        })
      }
      if(property.hasOwnproperty('get') && typeof property.get === 'function'){
        quene.push({
          path: current.path.concat([p]),
          object: property.get
        })
      }
      if(property.hasOwnproperty('set') && typeof property.set === 'function'){
        quene.push({
          path: current.path.concat([p]),
          object: property.set
        })
      }
    }
  }
}
