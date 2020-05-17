# 每周总结可以写在这里

## Finite State Machine

### if else 转 function

* main
```JavaScript
function stateMachine(target) {
  // 定义开始状态 start
  let state = start;
  for(let obj of target){
    // 通过固定的 input(obj), 让每个转态机来决定下次的状态迁移
    state = state(obj);
  }
  // 定义终止状态end
  return state === end;
}
```
* machines
```JavaScript
function start(input) {
  let conditon = true;
  if(conditon){
    return next1;
  }
  // conditon with input
  return start;
}

...

function next1() {

}

...

function nextN() {
  let conditon = true;
  if(conditon){
    return end;
  }
  // conditon with input
  return start;
}

...

function end(input) {
  return end;
}

```
