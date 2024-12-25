const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname);

const machines = rows.reduce(
  (acc, row) => {
    const last = acc.pop();

    if (row === "") {
      return [...acc, last, []];
    }

    return [...acc, [...last, row]];
  },
  [[]],
);

function getI(x1, y1, x2, y2, u, v) {
  return (x2 * v - y2 * u) / (x2 * y1 - y2 * x1);
}

function getJ(x1, x2, u, i) {
  return (u - i * x1) / x2;
}

function parseNumber(string) {
  const numPattern = /(-?\d+)/g;

  return Number(string.match(numPattern)[0]);
}

function calculateMinimalTokens(machines, higherPositionPrize) {
  let result = 0;

  for (const machine of machines) {
    const partsA = machine[0].split(" ");
    const partsB = machine[1].split(" ");
    const partsPrize = machine[2].split(" ");
    const machineOptions = [];
    const x1 = parseNumber(partsA[2]);
    const y1 = parseNumber(partsA[3]);
    const x2 = parseNumber(partsB[2]);
    const y2 = parseNumber(partsB[3]);
    let [prizeX, prizeY] = [
      parseNumber(partsPrize[1]),
      parseNumber(partsPrize[2]),
    ];

    if (higherPositionPrize) {
      prizeX += 10000000000000;
      prizeY += 10000000000000;
    }

    const i = getI(x1, y1, x2, y2, prizeX, prizeY);
    const j = getJ(x1, x2, prizeX, i);

    if (!Number.isInteger(j) || !Number.isInteger(i) || j < 0 || i < 0) {
      continue;
    }

    result += i * 3 + j;
  }

  return result;
}

console.log("result1", calculateMinimalTokens(machines));
console.log("result2", calculateMinimalTokens(machines, true));
