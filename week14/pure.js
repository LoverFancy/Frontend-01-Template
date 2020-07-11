export const createElement = (target, property, ...children) => {
  const element = typeof target === 'string' ?
  new Wraper({
    target,
    timer: {}
  }):
  new target({
    target: target.name,
    timer: {}
  })
  for (const key in property) {
    element.setAttribute(key, property[key]);
    element[key] = property[key];
  }
  for (let child of children) {
    if (typeof child === 'string') {
      child = new Text(child);
    }
    element.appendChild(child);
  }
  return element;
}
export class Pure {

  constructor({
    target,
    timer
  } = {
    target: 'div',
    timer: {}
  }) {
    this.root = document.createElement(target);
    this.slot = document.createDocumentFragment();
    this.props = new Map();
    this.props.set('children', [])
  }

  setAttribute(name, value) {
    console.log('this.root', this.root);
    this.root.setAttribute(name, value);
  }
  
  appendChild(child) {
    this.props.get('children').push(child);
  }

  mountTo(parent) {
    for (let child of this.props.get('children')) {

      if (child) {
        if (child.mountTo) {
          child.mountTo(this.root)
        } else {
          if (Array.isArray(child)) {
            child.map((i) => {
              i.mountTo(this.root)
            })
          }else {
            this.root.appendChild(child);
          }
        }
      }
    }
    this.slot.appendChild(this.root);
    if (this.render()) {
      this.render().mountTo(parent);
    } else {
      parent.appendChild(this.root);
    }
  }

  render() {
    console.log('render this.slot', this.slot);
    return void 0;
  }
}

class Wraper extends Pure {
  constructor(config) {
    super(config);
  }

  addEventListener(...rest) {
    this.root.addEventListener(...rest)
  }
}

class Text {
  constructor(text){
    this.root = document.createTextNode(text);
  }

  mountTo(parent) {
    parent.appendChild(this.root);
  }
}