function enableGesture(body) {
  // TODO:
  // 根据时间触发状态 决定 是否 组织默认 行为
  // window.addEventListener('contextmenu', e => e.preventDefault())
  // document.addEventListener('selectstart', e => e.preventDefault())
  // document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

  // 处理 当触发行为 是 touch时，是无法获取 移动距离的。
  // 因为会存在 多指触控的情况，无法用 function的作用域进行处理
  // 所以需要 context 进行 记录存储
  const contexts = Object.create(null);

  // 定义 mouse 用的symbol，用于 与 touch 的 identifier 区分
  const MOUSE_SYMBOL = Symbol('mouse');

  // 移动端 浏览器 是默认 开启 鼠标 和 触控 事件的
  // 所以 移动端时主动 关闭 鼠标事件
  // pc端 模式 ontouchstart 是 undefind
  // 移动端 模式 ontouchstart 是 null
  if (document.ontouchstart !== null) {
    body.addEventListener('mousedown', () => {
      contexts[MOUSE_SYMBOL] = Object.create(null);
      start(event, contexts[MOUSE_SYMBOL]);
      const mouseMove = event => {
        move(event, contexts[MOUSE_SYMBOL])
      }
      const mouseEnd = (event) => {
        end(event, contexts[MOUSE_SYMBOL])
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseEnd)
      }
      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', mouseEnd);
    })
  }

  body.addEventListener('touchstart', (event) => {
    for (let touch of event.changedTouches) {
      contexts[touch.identifier] = Object.create(null);
      start(touch, contexts[touch.identifier]);
    }
  })

  body.addEventListener('touchmove', (event) => {
    for (let touch of event.changedTouches) {
      move(touch, contexts[touch.identifier]);
    }
  })

  body.addEventListener('touchend', (event) => {
    for (let touch of event.changedTouches) {
      end(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  })

  body.addEventListener('touchcancel', (event) => {
    for (let touch of event.changedTouches) {
      cancel(touch, contexts[touch.identifier]);
      delete contexts[touch.identifier];
    }
  })
  // touchend `touchcancel` 有至少且只会触发其中一个

  // tap: start 之后 很快 end, 就是 tap
  // pan - panstart panmove panend
  // flick
  // press

  const start = (point, context) => {
    body.dispatchEvent(createEvent('start', {
      startX: context.startX,
      startY: context.startY,
      clientX: point.clientX,
      clientY: point.clientY
    }));

    context.startX = point.clientX, context.startY = point.clientY;
    context.moves = [];
    context.isTap = true;
    context.isPan = false;
    context.isPress = false;

    context.timeHandler = setTimeout(() => {
      if (context.isPan) {
        return;
      }

      context.isTap = false;
      context.isPan = false;
      context.isPress = true;
      body.dispatchEvent(createEvent('pressstart', {}));

    }, 500)
  }

  const move = (point, context) => {
    let dx = point.clientX - context.startX,
      dy = point.clientY - context.startY;

    if (dx ** 2 + dy ** 2 > 100 && !context.isPan) {

      if (context.isPress) {
        body.dispatchEvent(createEvent('presscancel', {}));
      }
      context.isTap = false;
      context.isPan = true;
      context.isPress = false;

      body.dispatchEvent(createEvent('panstart', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      }));
    }

    if (context.isPan) {

      context.moves.push({
        dx,
        dy,
        t: Date.now()
      })

      context.moves = context.moves.filter(record => Date.now() - record.t < 300)
      body.dispatchEvent(createEvent('pan', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY
      }));
    }
  }

  const end = (point, context) => {
    if (context.isTap) {
      body.dispatchEvent(createEvent('tap', {}));
    }

    if (context.isPan) {
      const dx = point.clientX - context.startX;
      const dy = point.clientY - context.startY;
      const record = context.moves[0];
      const speed = Math.sqrt(((record.dx - dx) ** 2 + (record.dy - dy) ** 2)) / (Date.now() - record.t);
      let isFilck = speed > 2.5;
      if (isFilck) {
        body.dispatchEvent(createEvent('flick', {
          startX: context.startX,
          startY: context.startY,
          clientX: point.clientX,
          clientY: point.clientY,
          speed
        }));
      }
      body.dispatchEvent(createEvent('panend', {
        startX: context.startX,
        startY: context.startY,
        clientX: point.clientX,
        clientY: point.clientY,
        speed,
        isFilck
      }));
    }

    if (context.isPress) {
      body.dispatchEvent(createEvent('pressend', {}));
    }

    clearTimeout(context.timeHandler)
  }

  const cancel = (point, context) => {
    clearTimeout(context.timeHandler)
  }

  const createEvent = (eventName, property) => {
    const event = new CustomEvent(eventName, {
      detail: property
    });
    return event;
  }
}
