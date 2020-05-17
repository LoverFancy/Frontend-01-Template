let calcString = (str) => {
  const list = dealBlock(str);
  const reAssemble = (list, ) => {
    list.map((i) => {
      if(/^\[\d+\]$/.test(i)){
        let index = i.replace('(', '').replace(')', '');
        i = reAssemble(list[index]);
        const sliceIndex = list[index].indexOf('&');
        list[index].slice(0, sliceIndex);
      }
      return i
    })
  }
  reAssemble()
  console.log(list)
}

let dealBlock = (str) => {
  const record = [];
  const list = [[]]
  let blockNum = 0;
  str.split('').map((i, index) => {
    if(!list[blockNum]){
      list[blockNum] = [];
    }
    if(i.codePointAt(0) === 40){
      list[blockNum].push(`[${blockNum+1}]`);
      blockNum++;
    }else if(i.codePointAt(0) === 41){
      list[blockNum].push('&');
      blockNum--;
    }else {
      list[blockNum].push(i);
    }
  })
  return list;
}



const sum = () => {

}

const minus = () => {

}

const muplti = () => {

}

const divide = () => {

}
