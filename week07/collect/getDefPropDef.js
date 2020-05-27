const getDefPropDef = (standards) => {
  let iframe = document.createElement('iframe');
  document.body.innerHTML = '';
  document.body.appendChild(iframe);

  function getDefPropDef(element, event) {
    return new Promise((resolve) => {
      let handler = () => {
        resolve();
        element.removeEventListener(event, handler)
      }
      element.addEventListener(event, handler)
    })
  }

  async function load() {
    for(let item of standards){
      iframe.src = item.url;
      await getDefPropDef(iframe, 'load');
    }
  }
}
