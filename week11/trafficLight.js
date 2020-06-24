let state = 'green';
async function change(duration, status) {
  document.getElementsByClassName(state)[0].setAttribute('class', `${state}`);
  state = status;
  document.getElementsByClassName(state)[0].setAttribute('class', `${state} light`);
  await sleep(duration);
}
function sleep(duration) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}
async function start() {
  while(true){
    await change(8000, 'green')
    await change(3000, 'yellow')
    await change(3000, 'red')
  }
}
start();