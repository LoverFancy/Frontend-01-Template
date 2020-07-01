class Sorted {
  constructor(data, compare) {
    this.data = data.slice()
    this.compare = compare || ((a, b) => a - b);
  }

  take() {
    if (!this.data.length) {
      return;
    }
    let min = this.data[0];
    let minIndex = 0;
    for (let i = 1; i < this.data.length; i++) {
      if (this.compare(this.data[i], min) < 0) {
        min = this.data[i];
        minIndex = i;
      }
    }
    this.data[minIndex] = this.data[this.data.length - 1];
    this.data.pop();
    return min;
  }

  insert(v) {
    this.data.push(v)
  }

  get length() {
    return this.data.length;
  }
}

class BinaryHeap {
  constructor(data, compare) {
    this.data = data
    this.compare = compare
  }

  take() {
    if (!this.data.length) {
      return;
    }
    let min = this.data[0];
    let i = 0;
    // fix heap
    while (i < this.data.length) {
      if (i * 2 + 1 >= this.data.length) {
        break
      }
      if (i * 2 + 2 >= this.data.length) {
        this.data[i] = this.data[i * 2 + 1];
        i = i * 2 + 1
        break
      }
      if (this.compare(this.data[i * 2 + 1], this.data[i * 2 + 2]) < 0) {
        this.data[i] = this.data[i * 2 + 1]
        i = i * 2 + 1;
      } else {
        this.data[i] = this.data[i * 2 + 2]
        i = i * 2 + 2;
      }
    }
    if (i < this.data.length - 1) {
      this.insertAt(i, this.data.pop())
    } else {
      this.data.pop()
    }
    return min;
  }

  insert(v) {
    console.log(this.data.length, v);

    this.insertAt(this.data.length, v)
  }

  insertAt(i, v) {
    this.data[i] = v;
    while (i > 0 && this.compare(v, this.data[Math.floor((i - 1) / 2)])) {
      this.data[i] = this.data[Math.floor((i - 1) / 2)];
      this.data[Math.floor((i - 1) / 2)] = v;
      i = Math.floor((i - 1) / 2);
    }
  }

  get length() {
    return this.data.length;
  }
}

function sleep(t) {
  return new Promise(function (resolve) {
    setTimeout(resolve, t);
  });
}

async function findPath(map, start, end) {
  map = map.slice();
  let table = new Array(10000).fill(Infinity);

  table[start[1] * 100 + start[0]] = 0;
  function distance([x, y]) {
    return (x - end[0]) ** 2 + (y - end[1]) ** 2;
  }

  // let collection = new Sorted([start], (a, b) => distance(a) - distance(b)).take();
  

  let collection = new Sorted([start], (a, b) => distance(a) - distance(b));

  // container.children[5050].style.backgroundColor = 'red';

  async function insert([x, y], pre, fromStart) {
    // todo
    // if (map[100 * y + x] !== 0) {
    //   return;
    // }
    if (map[100 * y + x] === 1) {
      return;
    }
    if (x < 0 || y < 0 || x >= 100 || y >= 100) {
      return;
    }
    if (fromStart >= table[100 * y + x]) {
      return;
    }
    map[100 * y + x] = pre;
    table[100 * y + x] = fromStart;
    await sleep(5);
    container.children[y * 100 + x].style.backgroundColor = 'lightgreen';
    collection.insert([x, y]);
  }

  while (collection.length) {
    // let [x, y] = collection.shift();
    let [x, y] = collection.take();
    let fromStart = table[100 * y + x];

    if (x === end[0] && y === end[1]) {
      let path = [];
      while (x !== start[0] || y !== start[1]) {
        path.push([x, y]);
        await sleep(30);
        container.children[y * 100 + x].style.backgroundColor = 'pink';

        [x, y] = map[y * 100 + x];
      }
      return path;
    }
    let left = x - 1;
    let right = x + 1;
    let top = y - 1;
    let bottom = y + 1;
    let preSite = [x, y];
    await insert([left, y], preSite, fromStart + 1);
    await insert([right, y], preSite, fromStart + 1);
    await insert([x, top], preSite, fromStart + 1);
    await insert([x, bottom], preSite, fromStart + 1);

    // await insert([left, top], preSite);

    // await insert([right, top], preSite);

    // await insert([left, bottom], preSite);

    // await insert([right, bottom], preSite);

    // if (map[top * 100 + x] === 1 && map[y * 100 + left] === 1) {
    //   await sleep(1);
    //   container.children[y * 100 + x].style.backgroundColor = 'blue';
    // }
    if (map[top * 100 + x] !== 1 && map[y * 100 + left] !== 1) {
      await insert([left, top], preSite, fromStart + 1.4);
    }
    // if (map[top * 100 + x] === 1 && map[y * 100 + right] === 1) {
    //   await sleep(1);
    //   container.children[y * 100 + x].style.backgroundColor = 'blue';
    // }
    if (map[top * 100 + x] !== 1 && map[y * 100 + right] !== 1) {
      await insert([right, top], preSite, fromStart + 1.4);
    }
    // if (map[bottom * 100 + x] === 1 && map[y * 100 + left] === 1) {
    //   await sleep(1);
    //   container.children[y * 100 + x].style.backgroundColor = 'blue';
    // }
    if (map[bottom * 100 + x] !== 1 && map[y * 100 + left] !== 1) {
      await insert([left, bottom], preSite, fromStart + 1.4);
    }
    // if (map[bottom * 100 + x] === 1 && map[y * 100 + right] === 1) {
    //   await sleep(1);
    //   container.children[y * 100 + x].style.backgroundColor = 'blue';
    // }
    if (map[bottom * 100 + x] !== 1 && map[y * 100 + right] !== 1) {
      await insert([right, bottom], preSite, fromStart + 1.4);
    }
  }

  return false
}