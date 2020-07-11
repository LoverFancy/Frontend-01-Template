import {
  createElement, Pure
} from './pure';
// const createElement = (target, property, ...children) => {
//   let name = 'div';
//   if (typeof target === 'string') {
//     name = target;    
//   } else {
//     name = target.name;
//   }
//   // const element = document.createElement(name);
//   const element = new target;
//   for (const key in property) {
//     element.setAttribute(key, property[key]);
//   }
//   for(const child of children){
//     element.appendChild(child);
//   }
//   return element;
// }
// class Pure {

//   constructor() {
//     this.props = {
//       children: []
//     };
//     this.root = document.createElement('div');
//   }

//   setAttribute(name, value) {
//     this.root.setAttribute(name, value);
//     // this.props[name] = value;
//   }

//   appendChild(child) {
//     this.props.children.push(child);
//   }

//   mountTo(parent) {
//     for (const child of this.props.children) {
//       if (typeof child === 'string') {
//         this.root.innerText = child;
//       } else {
//         child.mountTo(this.root)
//       }
//     }
//     parent.appendChild(this.root);
//   }
// }
class Parent extends Pure {
  constructor(){
    super();
    console.log(this);
    
  }
  render() {
    
    return <div>
      <header > {this.props.get('title')} </header>
      <content>
      {
        this.slot
      }
      </content>
      <footer>foot</footer>
    </div>
  }
}
class Child extends Pure {
  constructor() {
    super();
  }
}

class Carousel extends Pure {

  constructor() {
    // this.root = null;
    super();
    this.data = [];
  }

  render() {

    let component = this.data.map(url => {
      let img = <img src = {url}> </img>;
      img.addEventListener('dragstart', e => e.preventDefault())
      return img
    });

    const container = <div class='carousel'> {
      component
    } </div>;


    let position = 0;

    console.log(component);

    let nextPicture = () => {

      const nextPosition = (position + 1) % this.data.length;
      const lastPosition = (this.data.length + position - 1) % this.data.length;

      let current = component[position].root;
      let next = component[nextPosition].root;
      // let last = this.root.childNodes[lastPosition];


      current.style.transition = `ease 0s`;
      next.style.transition = `ease 0s`;

      current.style.transform = `translateX(${- 100 * position}%)`;
      next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

      setTimeout(() => {
        current.style.transition = `ease 0.5s`;
        next.style.transition = `ease 0.5s`;


        // last.style.transition = `ease 0s`;
        // last.style.transform = `translateX(${100}%)`;

        current.style.transform = `translateX(${-100 - 100 * position}%)`;
        next.style.transform = `translateX(${-100 * nextPosition}%)`;

        position = nextPosition;
      }, 16)

      position = nextPosition;

      setTimeout(nextPicture, 3000);
    }

    container.root.addEventListener('mousedown', (event) => {
      const {
        clientX: startX,
        clientY: startY
      } = event;

      const nextPosition = (position + 1) % this.data.length;
      const lastPosition = (this.data.length + position - 1) % this.data.length;

      let current = component[position].root;
      let next = component[nextPosition].root;
      let last = component[lastPosition].root;

      current.style.transition = `ease 0s`;
      next.style.transition = `ease 0s`;
      last.style.transition = `ease 0s`;

      current.style.transform = `translateX(${0 - 500 * position}px)`;
      last.style.transform = `translateX(${500 - 500 * lastPosition}px)`;
      next.style.transform = `translateX(${-500 - 100 * nextPosition}px)`;

      let move = (e) => {
        const {
          clientX: x,
          clientY: y
        } = e;

        current.style.transform = `translateX(${x - startX - 500 * position}px)`;
        next.style.transform = `translateX(${x - startX + 500 - 500 * nextPosition}px)`;
        last.style.transform = `translateX(${x - startX - 500 - 500 * lastPosition}px)`;
      };
      let up = (e) => {
        let offset = 0;

        if (e.clientX - startX > 250) {
          offset = 1;
        } else if (e.clientX - startX < -250) {
          offset = -1;
        }

        current.style.transition = '';
        next.style.transition = '';
        last.style.transition = '';

        current.style.transform = `translateX(${offset * 500 - 500 * position}px)`;
        next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition}px)`;
        last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPosition}px)`;

        position = (this.data.length + position + offset) % this.data.length;

        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
      };

      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    });

    setTimeout(nextPicture, 3000);
    
    return container;
  }
}

// let carousel = new Carousel();

// data



// mount 
// document.getElementById('container').appendChild(carousel.root);

const component = (
  <Carousel data = {
    [
      "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
      "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
      "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
      "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
    ]
  } >
  </Carousel>
);

component.mountTo(document.body)

console.log(component);
