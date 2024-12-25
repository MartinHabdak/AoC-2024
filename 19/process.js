const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname);
const towels = rows[0].split(",").map((a) => a.trim());
const designs = rows.slice(2, rows.length);

function canCreate(design, towels) {
  const designLength = design.length;
  const createMap = Array(designLength + 1).fill(false);
  createMap[0] = true;

  for (let i = 1; i <= designLength; i++) {
    for (let towel of towels) {
      const length = towel.length;

      if (i >= length && design.substr(i - length, length) === towel) {
        createMap[i] = createMap[i] || createMap[i - length];
      }
    }
  }

  return createMap[designLength];
}

function waysToCrate(design, towels) {
  let designLength = design.length;
  const numWays = new Array(designLength + 1).fill(0);
  numWays[0] = 1;

  for (let i = 1; i <= designLength; i++) {
    for (let towel of towels) {
      let length = towel.length;

      if (i >= length && design.substr(i - length, length) == towel) {
        numWays[i] += numWays[i - length];
      }
    }
  }

  return numWays[designLength];
}

function countDesigns(towels, designs) {
  let sol = 0;

  for (let design of designs) {
    sol += canCreate(design, towels);
  }

  return sol;
}

function countArrangements(towels, designs) {
  let sol = 0;

  for (let design of designs) {
    sol += waysToCrate(design, towels);
  }

  return sol;
}

console.log("result1", countDesigns(towels, designs));
console.log("result2", countArrangements(towels, designs));
