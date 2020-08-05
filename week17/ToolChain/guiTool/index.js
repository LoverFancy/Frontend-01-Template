// // var tty = require('tty');
// var ttys = require('ttys');
// const { resolve } = require('path');
// const { rejects } = require('assert');
// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });


// const { stdin, stdout } = ttys;

// stdout.write('hello world!\n');
// stdout.write("\033[1A");
// stdout.write('jack \n');



// const ask = async (content) => {
//   return new Promise((resolve, reject) => {
//     rl.question(content, (answer) => {
//       resolve(answer);
//       rl.close();
//     });
//   })
// };

// void async function(){
//   console.log(await ask('your name ?'));
// }();

const process = require("process");
const readline = require("readline");

const { stdin, stdout } = process;

stdin.setRawMode(true);

stdin.resume();

stdin.setEncoding('utf8');

function up(n = 1) {
  stdout.write("\033["+n+"A");
}
function down(n = 1) {
  stdout.write("\033["+n+"B");
}
function left(n = 1) {
  stdout.write("\033["+n+"D");
}
function right(n = 1) {
  stdout.write("\033["+n+"C");
}

const getChar = () => {
  return new Promise((resolve, reject) => {
    stdin.once("data", (key) => {
      resolve(key)
    });
  })
}

const select = async (choices) => {
  let selected = 0
  for (let i = 0; i < choices.length; i++) {
    if (i === selected){
      stdout.write("[\x1b[31m√\x1b[0m]" + choices[i] + "\n");
    } else {
      stdout.write("[ ]" + choices[i] + "\n");
    }
  }
  up(choices.length);
  right();
  while (true) {
    let char = await getChar();
    if (char === "\u0003") {
      process.exit();
      break;
    }
    if(char === 'w' && selected > 0){
      stdout.write(" ");
      left();
      selected--;
      up();
      stdout.write("\x1b[31m√\x1b[0m");
      left();
    }
    if (char === "s" && selected < choices.length - 1) {
      stdout.write(" ");
      left();
      selected++;
      down();
      stdout.write("\x1b[31m√\x1b[0m");
      left();
    }

    if(char === '\r') {
      down(choices.length - selected)
      left();
      return choices[selected]
    }
  }
};

void (async () => {
  stdout.write("which framework do you want to choice ?\n");
  const result = await select(['vue', 'react', 'angular']);
  stdout.write('your choice is ' + result +'!\n');
  process.exit();
})();

