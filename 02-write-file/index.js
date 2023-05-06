const fs = require('fs');
const path = require('path');
const { stdin, stdout } = require('process');
const readline = require('readline');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);

console.log('hi, you can write some text here');

function closeStream() {
  rl.close();
  stdout.write('goodbuy my dear friend');
}

const writeStream = fs.createWriteStream(filePath, 'utf-8');

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});
rl.on('SIGINT', () => {
  closeStream();
});
rl.on('line', (input) => {
  input.trim().toLowerCase() === 'exit' ? closeStream() : writeStream.write(input);
});
