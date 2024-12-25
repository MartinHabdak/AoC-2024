const { getInput } = require("../utils/input");
const { aStar } = require("../utils/graph");

const [rows, grid] = getInput(__dirname);
const inputCoordinates = rows.map((row) => row.split(",").map(Number));
const maxX = rows.length > 25 ? 71 : 7;
const maxY = rows.length > 25 ? 71 : 7;
const simulateBytes = rows.length > 25 ? 1024 : 12;
const start = [0, 0];
const end = [maxX - 1, maxY - 1];

function getMinimumSteps(inputCoordinates) {
  let steps = 0;
  const corruptedLocations = {};

  for (let i = 0; i < simulateBytes; i++) {
    corruptedLocations[inputCoordinates[i]] = true;
  }

  const [reachedEnd, path] = canReachEnd(corruptedLocations);

  if (reachedEnd) {
    let current = end;

    while (!(current[0] === start[0] && current[1] === start[1])) {
      current = path[current];
      steps++;
    }
  }

  return steps;
}

function canReachEnd(corruptedLocations) {
  const path = aStar(start, end, corruptedLocations, maxX, maxY);

  if (path[end]) {
    return [true, path];
  }

  return [false, path];
}

function clearLastConsoleLine() {
  process.stdout.write("\x1b[A");
  process.stdout.write("\x1b[K");
}

function getFirstByte(inputCoordinates) {
  let i = simulateBytes;

  for (i; i < inputCoordinates.length; i++) {
    if (i > simulateBytes) {
      clearLastConsoleLine();
    }

    console.log(`${i}/${inputCoordinates.length}`);

    const corruptedLocations = {};

    for (let coord of inputCoordinates.slice(0, i)) {
      corruptedLocations[coord] = true;
    }

    if (!canReachEnd(corruptedLocations)[0]) {
      break;
    }
  }

  return inputCoordinates[i - 1];
}

console.log("result1", getMinimumSteps(inputCoordinates));
console.log("result2", getFirstByte(inputCoordinates));
