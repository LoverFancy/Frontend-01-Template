var merge = function (intervals) {
  if (intervals.length === 0) {
    return intervals;
  }
  const lastest = [intervals[0]];
  for (let i = 1; i < intervals.length; i++){
    const [ is, ie ] = intervals[i];
    const [ ls, le ] = lastest[lastest.length - 1];
    if ( le >= is || (ls <= ie && le >= ie) || (is >= ls && ie <=le) ) {
      if (ie > le){
        lastest[lastest.length - 1][1] = intervals[i][1];
      }
      if(ls > is){
        lastest[lastest.length - 1][0] = intervals[i][0];
      }
    }else {
      lastest.push(intervals[i])
    }
  }
  return lastest;
};