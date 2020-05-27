const images = require('images');


function render(view, element) {
  if(element.style){
    var img = images(element.style.width, element.style.height);

    if(element.style['background-color']){
      const color = element.style['background-color'] || 'rgb(0,0,0)';
      color.match(/rgb\((\d+),(\d+),(\d+)\)/);
      img.fill(Number(RegExp.$1),Number(RegExp.$2),Number(RegExp.$3), 1);
      view.draw(img, element.style.left || 0, element.style.right || 0)
    }
  }

  if(element.children) {
    for(let child of element.children){
      render(view, child)
    }
  }
}


module.exports = render
