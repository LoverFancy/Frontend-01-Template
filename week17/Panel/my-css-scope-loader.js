let css = require('css');

module.exports = function(source, map) {
  // const styleSheet = css.parse(source);

  // let name = this.resourcePath.match(/([^/]+).css$/)[1];

  // console.log('resource', this.resource, source);

  // for (let rule of styleSheet.stylesheet.rules) {
  //   rule.selectors = rule.selectors.map(selector => {
  //     return selector.match(new RegExp(`^(.${name})[\\s\\S]*$`)) ? selector :
  //       `.${name} ${selector}`
  //   })
      
  // }
  // return `
  //   let style = document.createElement('style');

  //   style.innerHTML = ${JSON.stringify(css.stringify(styleSheet))};

  //   document.documentElement.appendChild(style);
  // `;
  return ''
}

// const resourceQuery = qs.parse(this.resource.split('?')[1]);
// const classNameReg = /\.([^{]+)(\s*)\{/g;
// const scopeId = resourceQuery.scopeId;
// const classnames = resourceQuery.classnames && resourceQuery.classnames.split('($$)');
// if (scopeId && classnames) {
//   return source.replace(classNameReg, (matchItem) => {
//     const theClassName = matchItem.match(/\.([^{]+)(\s*)\{/)[1].trim();
//     // 兼容css的后代选择器模式，比如 .a .b{}
//     const classValues = theClassName.split(/(\s+)/);
//     const ultiClassName = classValues.map((item, index) => {
//       const checkValue = index === 0 ? `.${item}` : item;
//       return classnames.indexOf(checkValue) >= 0 ? `${checkValue}-${scopeId}` : checkValue;
//     }).join(" ");
//     return `${ultiClassName} {`;
//   })
// }
// return source