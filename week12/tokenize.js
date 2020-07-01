function createAST(source) {
  
}

function functionMatch(string) {
  let state = start;
  for (let c of string) {
    state = state(c)
  }
  return state === end;
}

function start(c) {
  if (c === 'a') {
    return founA;
  }
  // 不满足条件时，状态不变
  return start;
}

function end(c) {
  return end;
}

function founA(c) {
  if (c === 'b') {
    return founB
  }
  return start;
}

function founB(c) {
  if (c === 'c') {
    return founC
  }
  return start;
}

function founC(c) {
  if (c === 'd') {
    return founD
  }
  return start;
}

function founD(c) {
  if (c === 'e') {
    return end;
  }
  return start;
}