function match(string) {
  let state = start;
  for (let c of string) {
    state = state(c);
  }
  return state === end;
}

// abababx

function start(c) {
  if(c === 'a'){
    return founA;
  }
  // 不满足条件时，状态不变
  return start;
}

function end(c) {
  return end;
}

function founA(c) {
  if(c === 'b'){
    return founB
  }
  return start(c);
}

function founA2(c) {
  if(c === 'b'){
    return founB2
  }
  return start(c);
}

function founA3(c) {
  if(c === 'b'){
    return founB3
  }
  return start(c);
}

function founB(c) {
  if(c === 'a'){
    return founA2
  }
  return start;
}

function founB2(c) {
  if(c === 'a'){
    return founA3
  }
  return start;
}
function founB3(c) {
  if(c === 'x'){
    return end
  }
  return founB2(c);
}
