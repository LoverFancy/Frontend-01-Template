let map = localStorage.map ? JSON.parse(localStorage.map) : new Array(10000).fill(0);

let container = document.getElementById('root');

let mouse = false;

let clear = false;

for (let y = 0; y < 100; y++) {
  for(let x = 0; x < 100; x++){
    const cell = document.createElement('div');
    cell.classList.add("cell");
    if (map[y * 100 + x] === 1) {
      cell.style.backgroundColor = 'black';
    }
    cell.addEventListener('mousemove', () => {
      if (mouse) {
        if (clear) {
          cell.style.backgroundColor = '';
          map[y * 100 + x] = 0;
        } else {
          cell.style.backgroundColor = 'black';
          map[y * 100 + x] = 1;
        }
      }
    })
    container.appendChild(cell);
  }
}

document.addEventListener('mousedown', (e) => {
  mouse = true;
  clear = (e.button === 2)
})

document.addEventListener('mouseup', () => mouse = false);

document.addEventListener('contextmenu', (e) => e.preventDefault());

const saveBtn = document.getElementById('save')
saveBtn.addEventListener('click', () => {
  try {
    localStorage.map = JSON.stringify(map)
  } catch (e) {
  }
})
