let dragable = document.getElementById('dragable');

let baseX = 0, baseY = 0;

dragable.addEventListener('mousedown', (event) => {
  const { clientX: startX, clientY: startY } = event;
  let move = (e) => {
    const { clientX: x, clientY: y } = e;
    // dragable.style.transform = `translate(${x - startX + baseX}px, ${y - startY + baseY}px)`;
    let range = nearest(x, y);
    range.insertNode(dragable);    
  };
  let up = (e) => {
    baseX = baseX + e.clientX - startX, baseY = baseY + e.clientY - startY;
    document.removeEventListener('mousemove', move);
    document.removeEventListener('mouseup', up);
    // document.removeEventListener('selectstart', e => e.preventDefault());
  };

  document.addEventListener('mousemove', move);
  document.addEventListener('mouseup', up);
});


let ranges = [];
let container = document.getElementById('container');

for (let index = 0; index < container.childNodes[0].textContent.length; index++) {
  const range = document.createRange();
  range.setStart(container.childNodes[0], index);
  range.setEnd(container.childNodes[0], index);
  ranges.push(range);
}

function nearest(X, Y) {
  let nearestRange = null;
  let distance = Infinity;
  for (let range of ranges) {
    let { x, y } = range.getBoundingClientRect();
    let d = (X - x) ** 2 + (Y - y) ** 2;
    if(d < distance){
      distance = d;
      nearestRange = range;
    }
  }
  return nearestRange;
}

function throttle(fn, wait) {
  var pre = Date.now();
  return function () {
    var context = this;
    var args = arguments;
    var now = Date.now();
    if (now - pre >= wait) {
      fn.apply(context, args);
      pre = Date.now();
    }
  }
}

document.addEventListener('selectstart', e => e.preventDefault());
