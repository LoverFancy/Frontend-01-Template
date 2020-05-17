function conditonMatch(string) {
  let founA = false;
  let founB = false;
  let founC = false;
  let founD = false;
  let founE = false;
  for(let c of string){
    if(c === 'a'){
      founA = true;
    }else if (founA && c === 'b') {
      founB = true;
    }else if (founB && c === 'c') {
      founC = true;
    }else if (founC && c === 'd') {
      founD = true;
    }else if (founD && c === 'e') {
      return true;
    }else {
      founA = false;
      founB = false;
      founC = false;
      founD = false;
    }
  }
  return false;
}

// conditonMatch('abcdef')

function functionMatch(string) {
  let state = start;
  for(let c of string){
    state = state(c)
  }
  return state === end;
}

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
  return start;
}

function founB(c) {
  if(c === 'c'){
    return founC
  }
  return start;
}

function founC(c) {
  if(c === 'd'){
    return founD
  }
  return start;
}

function founD(c) {
  if(c === 'e'){
    return end;
  }
  return start;
}

// functionMatch('abcdef')
