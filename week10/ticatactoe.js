let pattern = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

let color = 1;

let end = false;

function rest() {
  pattern = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
  ];
  end = false;
  show();
}

function setAttributes(element, attributes) {
  for(let attributeName in attributes) {
    element.setAttribute(attributeName, attributes[attributeName])
  }
}
const a = '⭕';
const b = '❌';
function show() {
  let dc = document.getElementById('root');
  dc.innerText = '';
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      const base = document.createElement('div');
      setAttributes(base, { class: 'cell' })
      base.innerText = pattern[i][j] === 1 ? a : pattern[i][j] === 2 ? b : ' ';
      base.addEventListener('click', () => userMove(i, j))
      dc.appendChild(base);
    }
  }
  let restBT = document.getElementById('rest');
  if(end){
    setAttributes(restBT, { style: 'display:block' })
    restBT.addEventListener('click', () => rest())
  }else {
    setAttributes(restBT, { style: 'display:none' })
  }
}

function userMove(x, y) {
  if(end){
    return void 0;
  }
  if(pattern[x][y] !== 0) {
    return
  }
  pattern[x][y] = color;
  end = check({ pattern, color, x, y });
  if(end){
    // console.log('user win');
    show();
    window.alter('user win');
    return void 0;
  }else {
    color = 3 - color;
    computerMove()
  }
}
function computerMove() {

  const { point } = bestChoice(pattern, color, true);
  const [ x, y ] = point;
  if(typeof x !== 'undefined' && typeof y !== 'undefined') {
    pattern[x][y] = color;
  }
  end = check({ pattern, color, x, y});
  color = 3 - color;
  show();
  if(end){
    // console.log('computer win');
    window.alert('computer win');
  }
}

function diagonalLine(pattern, color) {
  if(pattern[1][1] === color) {
    let win = true;
    const leftUpToDown = [[0,0], [2,2]];
    win = leftUpToDown.every(([x, y]) => pattern[x][y] === color);
    if(win){
      return true
    }
    const rightUpToDown = [[0,2], [2,0]];
    win = rightUpToDown.every(([x, y]) => pattern[x][y] === color);
    return win
  }
  return false;
}

function check({ pattern, color, x, y }) {
  const rowWin = [0,1,2].every((i) => pattern[x][i] === color);
  const columnWin = [0,1,2].every((i) => pattern[i][y] === color);
  if(rowWin || columnWin) {
    return true;
  }
  if((x+y)%2 === 0){
    // console.log('here', diagonalLine(pattern, color));
    return diagonalLine(pattern, color);
  }
  return false;
}

function clone(t) {
  return JSON.parse(JSON.stringify(t));
}

function willWin(pattern, color) {
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      if(pattern[i][j] !== 0)
        continue;
      let temp = clone(pattern);
      temp[i][j] = color;
      if(check({ pattern, color, x: i, y: j })){
        return true;
      }
    }
  }
  return null
}

let openings = new Map();

openings.set(
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ].toString() + '1'
,
{
  point: [1,1],
  result: 0
}
)

openings.set(
  [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0]
  ].toString() + '2'
,
{
  point: [0,1],
  result: 0
}
)


function bestChoice(pattern, color, needFull = false) {
  if(openings.has(pattern.toString()+color)) {
    return openings.get(pattern.toString()+color)
  }
  let point = willWin(pattern, color)
  if(point) {
    return  {
      point,
      result: 1
    }
  }
  let result = -1;
  outer: for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      if(pattern[i][j] !== 0)
        continue;
      let temp = clone(pattern);
      temp[i][j] = color;
      let opp = bestChoice(temp, 3 - color)
      if(-opp.result >= result){
        point = [i, j];
        result = -opp.result;
      }
      if(needFull && result === 1){
          break outer;
      }
    }
  }
  return  {
    point,
    result: point ? result : 0
  }
}

show()
