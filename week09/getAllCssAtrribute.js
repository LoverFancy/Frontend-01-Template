function getAllCssAtrribute() {
  const { getComputedStyle, document } = window;
  const body = document.getElementsByTagName('body')[0];
  const allCssAttribute = getComputedStyle(body)
  // delete useless attributes
  let { length } = allCssAttribute;
  const webkitAttributes = [];
  const normalAttributes = [];
  while (length > 0) {
    length--;
    const attribute = allCssAttribute[length];
    if(attribute.includes('-webkit-')) {
      webkitAttributes.push(attribute);
    }else {
      normalAttributes.push(attribute);
    }
  }
  return {
    normal: normalAttributes,
    webkit: webkitAttributes
  };
}

module.exports = {
  getAllCssAtrribute
}
