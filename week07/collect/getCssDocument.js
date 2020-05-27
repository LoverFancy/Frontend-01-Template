/**
 * [getCSSDocInW3C get css doc by rule in w3c site]
 * @method getCSSDocInW3C
 * @return {[type]}       [all css doc in w3c]
 */
const getCSSDocInW3C = () => {
  const w3c = document.getElementById('container');
  const standards = [];
  w3c.children.forEach((i) => {
      if(i.getAttribute('data-tag').match(/css/)){
          standards.push({
            title: i.children[1].innerText,
            url: i.children[1].children[0].getAttribute('href')
          })
      }
  })
  return standards;
}
