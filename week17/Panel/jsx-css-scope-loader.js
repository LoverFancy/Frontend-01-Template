const md5 = require('md5');

const mermoryCache = new Map();

const hashComponentClass = (fileName) => {
  if (mermoryCache.has(fileName)) {
    return mermoryCache.get(fileName);
  }
  const hash = md5(fileName).substring(0, 10);
  mermoryCache.set(fileName, hash);
  return hash;
}

// both support signle and double Quotation marks
// eg:   className='1' | className="1"
const classReg = /class=[\"\']([\S\s]+)[\"\']/;

module.exports = function (source) {

  const compoentFileName = this.resourcePath.match(/([^/]+).js$/)[1];

  // console.log('compoentFileName', compoentFileName);

  const hash = hashComponentClass(compoentFileName);

  const classnames = [];

  console.log(source.match(classReg));

  return source.replace(classReg, (match) => {
    const classValue = match.match(/className=\"([^"]+)\"/);
    let baseName = 'className=';
    console.log('classValue', classValue);
    if (classValue.length > 0) {
      (classValue[1] || '').split(' ').forEach((i) => {
        const item = `.${i}`;
        baseName += `${item.trim()}-${hash} `
        classnames.push(item);
      })
    }
    console.log('baseName', baseName, 'classnames', classnames);
    return baseName;
  }).replace(/\.(css)/g, (match) => {
    return `${match}?scopeId=${hash}&classnames=${classnames.join('($$)')}`;
  });
}