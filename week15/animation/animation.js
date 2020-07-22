export function animation(params) {
  
}

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
    this.animations = [];
    this.state = 'init';
  }

  tick(){
    let t = Date.now() - this.timestamp;
    let animations = this.animations.filter(i => !i.finished);
    for (let animation of this.animations) {

      let {
        object,
        property,
        start,
        end,
        timingFC,
        template,
        delay,
        duration,
        startTime
      } = animation;

      let progression = timingFC((t - startTime - delay) / duration);
      if (t > (duration + delay + startTime)) {
        progression = 1;
        animation.finished = true;
      }
      // let value = start = progression * (end - start);

      let value = animation.valueFromProgression(progression)
      object[property] = template(value);
      
    }

    if (animations.length) {
      this.requestId = requestAnimationFrame(() => this.tick())
    }else {
      this.state = 'init';
    }
  }
  

  add(animation, startTime) {
    animation.finished = false;
    this.animations.push(animation)
    if(this.state === 'playing') {
      animation.startTime = startTime !== void 0  ? startTime : Date.now() - this.timestamp;
    }else {
      animation.startTime = startTime !== void 0 ? startTime : 0
    }
  }

  start() {
    if(this.state === 'init') {
      this.timestamp = Date.now();

      this.state = 'playing';

      this.tick()
    }
  }

  restart() {
    this.stop();
    this.start();
  }

  stop() {
    if (this.state === 'playing') {

      this.pause();

    }

    this.timestamp = null;

    this.state = 'init';

    this.pauseTimeStamp = null;

    this.animations = [];

    this.requestId = null;

    this.start()

  }

  pause() {
    if(this.state !== 'playing') {
      this.pauseTimeStamp = Date.now();
      this.state = 'pause';
      if (this.requestId !== null) {
        cancelAnimationFrame(this.requestId);
      }
    }
  }

  resume() {
    if (this.state !== 'pause') {
      this.state = 'playing';
      this.timestamp += Date.now() - this.pauseTimeStamp;
      this.tick();
    }
  }

  end() {

  }
}