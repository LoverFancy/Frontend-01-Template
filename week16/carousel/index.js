import { ToyReact, ToyReactDOM } from './pure';

import { Timeline, Animation } from './animation';
import { cubicBezier } from './cubicBezier';

const easa = cubicBezier(.84,.1,.91,.09);

const { Component } = ToyReact;

class Carousel extends Component  {

  constructor() {
    super();
    this.data = null;
  }

  render() {


    let nextHandler = null;

    let position = 0;

    let timeLine = new Timeline();

    timeLine.start();

    let children = this.data.map((url, currentPosition) => {

      const lastPosition =
        (currentPosition - 1 + this.data.length) % this.data.length;
      const nextPosition =
        (currentPosition + 1) % this.data.length;

      let offset = 0;

      const onStart = () => {
        timeLine.pause();
        clearTimeout(nextHandler);
        const currentElement = children[currentPosition].element;

        let currentTransformValue = Number(currentElement.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]);
        offset = currentTransformValue + 500 * currentPosition;
      };
      const onPan = (event) => {
        const currentElement = children[currentPosition].element;
        const lastElement = children[lastPosition].element;
        const nextElement = children[nextPosition].element;

        let currentTransformValue = -500 * currentPosition + offset;
        let lastTransformValue = -500 - 500 * lastPosition + offset;
        let nextTransformValue = 500 - 500 * nextPosition + offset;
        const { clientX, startX } = event.detail;
        let dx = clientX - startX;

        currentElement.style.transform = `translateX(${currentTransformValue + dx}px)`;
        lastElement.style.transform = `translateX(${
          lastTransformValue + dx
        }px)`;
        nextElement.style.transform = `translateX(${
          nextTransformValue + dx
        }px)`;
      };

      const onPanend = (event) => {
        let direction = 0;
        const { clientX, startX } = event.detail;
        let dx = clientX - startX;

        if(dx + offset > 250){
          direction = 1;
        } else if (dx + offset < -250) {
          direction = -1;
        }

        timeLine.reset();
        timeLine.start();

        const currentElement = children[currentPosition].element;
        const lastElement = children[lastPosition].element;
        const nextElement = children[nextPosition].element;

        let currentTransformValue = -500 * currentPosition + offset + dx;
        let lastTransformValue = -500 - 500 * lastPosition + offset + dx;
        let nextTransformValue = 500 - 500 * nextPosition + offset + dx;

        const currentAnimation = new Animation({
          object: currentElement.style,
          property: 'transform',
          template: v => `translateX(${v}px)`,
          start: currentTransformValue,
          end: -500 * currentPosition + direction + 500,
          duration: 500,
          timingFC: easa,
          delay: 0
        });

        const nextAnimation = new Animation({
          object: nextElement.style,
          property: 'transform',
          template: v => `translateX(${v}px)`,
          start: nextTransformValue,
          end: 500 - 500 * nextPosition + direction + 500,
          duration: 500,
          timingFC: easa,
          delay: 0
        });

        const lastAnimation = new Animation({
          object: lastElement.style,
          property: 'transform',
          template: v => `translateX(${v}px)`,
          start: lastTransformValue,
          end: -500 - 500 * lastPosition + direction + 500,
          duration: 500,
          timingFC: easa,
          delay: 0
        });

        timeLine.add(lastAnimation)
        timeLine.add(currentAnimation)
        timeLine.add(nextAnimation)

        position = (this.data.length + position - direction) % this.data.length;

        nextHandler = setTimeout(nextPicture, 3000);

      };

      let img = <img
        src={url}
        style='transform: translateX(0px)'
        onStart={onStart}
        onPan={onPan}
        enableGesture={true}
        onPanend={onPanend}
        onDragstart={(e) => e.preventDefault()}
        />;
      return img;
    });

    const container = (
      <div class="carousel">
        {children}
        <button onClick={() => timeLine.pause()}>pause</button>
        <button onClick={() => timeLine.restart()}>restart</button>
      </div>
    );


    let nextPicture =  () => {

      const nextPosition = (position + 1) % this.data.length;

      const current = children[position].element;
      const next = children[nextPosition].element;

      const currentAnimation = new Animation({
        object: current.style,
        property: 'transform',
        template: v => `translateX(${5 * v}px)`,
        start: -100 * position,
        end: -100 - 100 * position,
        duration: 500,
        timingFC: easa,
        delay: 0
      });

      const nextAnimation = new Animation({
        object: next.style,
        property: 'transform',
        template: v => `translateX(${5 * v}px)`,
        start: 100 - 100 * nextPosition,
        end: -100 * nextPosition,
        duration: 500,
        timingFC: easa,
        delay: 0
      });

      timeLine.add(currentAnimation);

      timeLine.add(nextAnimation);

      nextHandler = setTimeout(nextPicture, 3000);

      position = nextPosition;

    }

    nextHandler = setTimeout(nextPicture, 3000);

    return container;

  }
}

const component = (<Carousel data = {
    [
      "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
      "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
      "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
      "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
    ]
  } >
  </Carousel>
);

ToyReactDOM.render(
  component,
  document.body
)
