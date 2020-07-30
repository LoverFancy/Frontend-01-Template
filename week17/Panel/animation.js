export class Animation {
  constructor({ object, property, template, start, end, duration, timingFC, delay }) {
    this.object = object;
    this.property = property;
    this.template = template;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay || 0;
    this.timingFC = timingFC;
    //  || ((start, end) => {
    //    return (t) => start + (t / duration) * (end - start);
    //  });
  }

  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start);
  }
}
export class ColorAnimation {
  constructor({
    object, property, template, start, end, duration, timingFC, delay
  }) {
    this.object = object;
    this.property = property;
    this.template = template || ((v) => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a || 1})`);
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay || 0;
    this.timingFC = timingFC;
    //  || ((start, end) => {
    //    return (t) => start + (t / duration) * (end - start);
    //  });
  }

  valueFromProgression(progression) {
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a),
    }
  }
}

export class Timeline {

  constructor() {
    this.animations = new Set();
    this.finishedAnimations = new Set();
    this.addTimes = new Map();
    this.requestId = null;
    this.state = 'init';
  }

  tick(){
    let t = Date.now() - this.startTime;

    for (let animation of this.animations) {

      let {
        object,
        property,
        start,
        end,
        timingFC,
        template,
        delay,
        duration
      } = animation;

      let addTime = this.addTimes.get(animation);

      if (t < (delay + addTime)) {
        continue;
      }

      let progression = timingFC((t - addTime - delay) / duration);
      if (t > (duration + delay + addTime)) {
        progression = 1;
        this.animations.delete(animation)
        this.finishedAnimations.add(animation)
      }

      let value = animation.valueFromProgression(progression)
      object[property] = template(value);

    }
    if(this.animations.size) {
      this.requestId = requestAnimationFrame(() => this.tick())
    }else {
      this.requestId = null
    }

  }

  add(animation, addTime) {
    this.animations.add(animation)
    if (this.state === 'playing' && this.requestId === null) {
      this.tick();
    }
    if (this.state === 'playing') {
      this.addTimes.set(
        animation, addTime !== void 0 ? addTime : Date.now() - this.startTime
      )
    }else {
      this.addTimes.set(
        animation, addTime !== void 0 ? addTime : 0
      )
    }
  }

  start() {
    if(this.state !== 'init') {
      return;
    }

    this.state = 'playing';
    this.startTime = Date.now();

    this.tick()
  }

  reset() {
    if (this.state === 'playing') {
      this.pause();
    }

    for (let animation of this.finishedAnimations) {
      this.animations.add(animation)
    }

    this.state = 'init';
    this.requestId = null;

    this.startTime = Date.now();
    this.pauseTime = null;

    this.animations.clear();
    this.addTimes.clear();
    this.finishedAnimations.clear();
  }

  restart() {
    if (this.state === 'playing') {
      this.pause();
    }

    for(let animation of this.finishedAnimations){
      this.animations.add(animation)
    }

    this.animations.clear();
    this.finishedAnimations.clear();

    this.requestId = null;
    this.state = 'playing';

    this.startTime = Date.now();
    this.pauseTime = null;

    this.tick()
  }

  pause() {
    if(this.state !== 'playing') {
      return
    }
    this.state = 'pause';
    this.pauseTime = Date.now();
    if (this.requestId !== null) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    }
  }

  resume() {
    if (this.state !== 'pause') {
      return
    }
    this.state = 'playing';
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }

}
