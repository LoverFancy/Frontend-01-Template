const splite = (data) => {
  const noAttributeModule = {};
  const hasAttributesModule = {};
  const attributePropertysSet = new Set();
  for(let i in allCssAttribute) {
    if(allCssAttribute[i].length > 0){
      hasAttributesModule[i] = allCssAttribute[i];
      allCssAttribute[i].map((it) => attributePropertysSet.add(it));
    }else {
      noAttributeModule[i] = allCssAttribute[i];
    }
  }
  const allAttributePropertys = [];
  attributePropertysSet.forEach((i) => allAttributePropertys.push(i));
  return {
    noAttributeModule, hasAttributesModule, allAttributePropertys
  }
}
