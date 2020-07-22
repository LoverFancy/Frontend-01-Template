// import { createElement } from './pure';
import { Timeline, Animation } from './animation.js';
import { cubicBezier } from './cubicBezier.js';

const easa = cubicBezier(.84,.1,.91,.09);

class Carousel {

  constructor() {
    this.root = null;
    this.data = null;
    this.timeLine = new Timeline();

  }

  render() {
    this.root = document.createElement('div');
    this.root.classList.add('carousel');

    for (const d of this.data) {
      const element = document.createElement('img');
      element.src = d;
      element.addEventListener('dragstart', e => e.preventDefault())
      this.root.appendChild(element);
    }

    let position = 0;

    let tl = this.timeLine;

    let nextPicture =  () => {

      const nextPosition = (position + 1) % this.data.length;
      const lastPosition = (this.data.length + position - 1) % this.data.length;

      let current = this.root.childNodes[position];
      let next = this.root.childNodes[nextPosition];
      // let last = this.root.childNodes[lastPosition];


      // current.style.transition = `ease 0s`;
      // next.style.transition = `ease 0s`;
      //
      // current.style.transform = `translateX(${- 100 * position}%)`;
      // next.style.transform = `translateX(${100 - 100 * nextPosition}%)`;

      tl.add(new Animation({
        object: current.style,
        property: 'transform',
        template: v => `translateX(${v}%)`,
        start: - 100 * position,
        end: -100 - 100 * position,
        duration: 500,
        timingFC: easa,
        delay: 0
      }));

      tl.add(new Animation({
        object: next.style,
        property: 'transform',
        template: v => `translateX(${v}%)`,
        start: 100 - 100 * nextPosition,
        end: -100 * nextPosition,
        duration: 500,
        timingFC: easa,
        delay: 0
      }));

      tl.start()

      // setTimeout(() => {
      //   current.style.transition = `ease 0.5s`;
      //   next.style.transition = `ease 0.5s`;
      //
      //
      //   // last.style.transition = `ease 0s`;
      //   // last.style.transform = `translateX(${100}%)`;
      //
      //   current.style.transform = `translateX(${-100 - 100 * position}%)`;
      //   next.style.transform = `translateX(${-100 * nextPosition}%)`;
      //
      //   position = nextPosition;
      // }, 16)

      position = nextPosition;

    }

    // setTimeout(nextPicture, 3000);

    setInterval(nextPicture, 3000);


      // this.root.addEventListener('mousedown', (event) => {
      //   const {
      //     clientX: startX,
      //     clientY: startY
      //   } = event;
      //
      //   const nextPosition = (position + 1) % this.data.length;
      //   const lastPosition = (this.data.length + position - 1) % this.data.length;
      //
      //   let current = this.root.childNodes[position];
      //   let next = this.root.childNodes[nextPosition];
      //   let last = this.root.childNodes[lastPosition];
      //
      //   current.style.transition = `ease 0s`;
      //   next.style.transition = `ease 0s`;
      //   last.style.transition = `ease 0s`;
      //
      //   current.style.transform = `translateX(${0 - 500 * position}px)`;
      //   last.style.transform = `translateX(${500 - 500 * lastPosition}px)`;
      //   next.style.transform = `translateX(${-500 - 100 * nextPosition}px)`;
      //
      //   let move = (e) => {
      //     const {
      //       clientX: x,
      //       clientY: y
      //     } = e;
      //
      //     current.style.transform = `translateX(${x - startX - 500 * position}px)`;
      //     next.style.transform = `translateX(${x - startX + 500 - 500 * nextPosition}px)`;
      //     last.style.transform = `translateX(${x - startX - 500 - 500 * lastPosition}px)`;
      //   };
      //   let up = (e) => {
      //     let offset = 0;
      //
      //     if(e.clientX - startX > 250){
      //       offset = 1;
      //     } else if (e.clientX - startX < -250) {
      //       offset = -1;
      //     }
      //
      //     current.style.transition = '';
      //     next.style.transition = '';
      //     last.style.transition = '';
      //
      //     current.style.transform = `translateX(${offset * 500 - 500 * position}px)`;
      //     next.style.transform = `translateX(${offset * 500 + 500 - 500 * nextPosition}px)`;
      //     last.style.transform = `translateX(${offset * 500 - 500 - 500 * lastPosition}px)`;
      //
      //     position = (this.data.length + position + offset) % this.data.length;
      //
      //     document.removeEventListener('mousemove', move);
      //     document.removeEventListener('mouseup', up);
      //   };
      //
      //   document.addEventListener('mousemove', move);
      //   document.addEventListener('mouseup', up);
      // });

    // setTimeout(nextPicture, 3000);
  }
}

let carousel = new Carousel();

// data
carousel.data = [
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
];
carousel.render();



// mount
document.getElementById('root').appendChild(carousel.root);
