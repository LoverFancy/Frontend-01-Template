const getDefPropDef = (standards) => {
  let iframe = document.createElement('iframe');
  document.body.innerHTML = '';
  document.body.appendChild(iframe);

  const currentDocument = iframe.contentWindow.document;

  function getDefPropDef(element, event) {
    return new Promise((resolve) => {
      let handler = () => {
        resolve();
        element.removeEventListener(event, handler)
      }
      element.addEventListener(event, handler)
    })
  }
  const allCssAttribute = {};
  async function load() {
    for(let item of standards){
      iframe.src = item.url;
      await getDefPropDef(iframe, 'load');
      let { length, ...other } = iframe.contentWindow.document.querySelectorAll(`[data-link-type="property"]`) || [];
      const records = [];
      for (let i = 0; i < length; i++) {
        records.push(other[i].innerText);
      }
      allCssAttribute[item.title] = records;
    }
  }
  load();
  return allCssAttribute;
}
