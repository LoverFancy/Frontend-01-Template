const handlers = new Map();

const reactivies = new Map();

let usedReactivities = new Set();

const handler = {
  get(obj, prop) {
    usedReactivities.add([obj, prop]);
    if (typeof obj[prop] === 'object') {
      return reactive(obj[prop])
    }
    return obj[prop];
  },
  set(obj, prop, val) {
    obj[prop] = val;
    if (handlers.has(obj)) {
      if (handlers.get(obj).has(prop)) {
        for (let handler of handlers.get(obj).get(prop)) {
          handler()
        }
      }
    }
    return val;
  },
  defineProperty(target, key, descriptor) {
    target[key] = descriptor;
    return Object.defineProperty(target, key, descriptor)

  }
};

function reactive(o) {
  if (reactivies.has(o)) {
    return reactivies.get(o)
  }
  const proxy = new Proxy(o, handler);

  reactivies.set(o, proxy);
  reactivies.set(proxy, proxy);

  return proxy
}

function effect(handler) {
  usedReactivities.clear();
  handler();
  for (let usedReactivitiy of usedReactivities) {
    let [obj, prop] = usedReactivitiy;
    if (!handlers.has(obj)) {
      handlers.set(obj, new Map())
    }
    if (!handlers.get(obj).has(prop)) {
      handlers.get(obj).set(prop, [])
    }
    handlers.get(obj).get(prop).push(handler)
  }
}

// test

let o = {
  r: 100,
  g: 100,
  b: 100
};

let dumny;

let proxy = reactive(o);

// effect(() => dumny = proxy.a);

// console.log('first', dumny);

// proxy.a = 2;

// console.log('second', dumny);

// proxy.a = 3;

// console.log('third', dumny);

effect(() => {
  document.getElementById('r').value = proxy.r
});

effect(() => {
  document.getElementById('g').value = proxy.g
});

effect(() => {
  document.getElementById('b').value = proxy.b
});

effect(() => {
  const {
    r,
    g,
    b
  } = proxy;
  document.getElementById('color').style.backgroundColor = `rgb(${r}, ${g}, ${b})`
});

document.getElementById('r').addEventListener('input', e => {
  proxy.r = e.target.value;
});

document.getElementById('b').addEventListener('input', e => {
  proxy.b = e.target.value;
});

document.getElementById('g').addEventListener('input', e => {
  proxy.g = e.target.value;
});
