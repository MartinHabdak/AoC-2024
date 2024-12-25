const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname);
const [rows2] = getInput(__dirname, undefined, "input2.txt");

function parseMemory(data) {
  const mulPattern = /mul\((-?\d+),(-?\d+)\)/g;
  let total = 0;

  data.forEach((line) => {
    let match;
    while ((match = mulPattern.exec(line)) !== null) {
      const x = parseInt(match[1]);
      const y = parseInt(match[2]);

      total += x * y;
    }
  });

  return total;
}

function parseMemory2(data) {
  const doSplit = data.join("").split("do()");
  const memoryData = doSplit.reduce((acc, item) => [...acc, item.split("don't()")[0]], []);

  return parseMemory(memoryData);
}

console.log("result1", parseMemory(rows));
console.log("result2", parseMemory2(rows2));
