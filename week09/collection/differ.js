const differ = (a, b) => {
  const [ larger, small ] = a.length >= b.length ? [a, b] : [b, a]
  const largerSet = new Set();
  const smallSet = new Set();
  larger.map((i) => largerSet.add(i));
  small.map((i) => smallSet.add(i));
  const diff = [];
  largerSet.forEach((i) => {
    if(!smallSet.has(i)){
      diff.push(i)
    }
  });
  return diff;
}
