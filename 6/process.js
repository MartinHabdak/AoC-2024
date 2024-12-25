const { getInput } = require("../utils/input");
const { copyGrid } = require("../utils/grid");

const [, grid] = getInput(__dirname);

function getStart(grid) {
  let start = [];

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];

    for (let j = 0; j < row.length; j++) {
      const item = row[j];

      if (item === "^" || item === "v" || item === "<" || item === ">") {
        start = [i, j];
        break;
      }

      continue;
    }
  }

  return start;
}

function getNewGuard(guard) {
  let newGuard;

  if (guard === "^") {
    return ">";
  }

  if (guard === "v") {
    return "<";
  }

  if (guard === "<") {
    return "^";
  }

  return "v";
}

function getNextPosition(guard, x, y) {
  if (guard === "^") {
    return [x - 1, y];
  }

  if (guard === "v") {
    return [x + 1, y];
  }

  if (guard === "<") {
    return [x, y - 1];
  }

  return [x, y + 1];
}

function countGridVisits(gridData) {
  const grid = copyGrid(gridData);
  const start = getStart(grid);

  let guard = grid[start[0]][start[1]];
  let count = 1;
  grid[start[0]][start[1]] = "X";

  let currentPosition = start;
  while (true) {
    const [x, y] = currentPosition;
    const nextPosition = getNextPosition(guard, x, y);
    const [p, q] = nextPosition;
    const nextElement = grid[p]?.[q];

    if (!nextElement) {
      break;
    }

    if (nextElement !== "#") {
      if (nextElement !== "X") {
        count = count + 1;
      }

      grid[p][q] = "X";
      currentPosition = nextPosition;

      continue;
    }

    guard = getNewGuard(guard);
  }

  return count;
}

function countGridVisits2(grid) {
  const start = getStart(grid);
  let count = 0;

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];

    for (let j = 0; j < row.length; j++) {
      const numPos = grid.length * row.length;
      const copiedGrid = copyGrid(grid);
      let currentPosition = start;
      let countStartVisited = 0;
      let guard = grid[start[0]][start[1]];
      copiedGrid[i][j] = "#";

      while (true) {
        const [x, y] = currentPosition;
        const nextPosition = getNextPosition(guard, x, y);
        const [p, q] = nextPosition;
        const nextElement = copiedGrid[p]?.[q];

        if (!nextElement) {
          break;
        }

        countStartVisited = countStartVisited + 1;

        if (x === start[0] && y === start[1]) {
          countStartVisited = countStartVisited + 1;
        }

        if (nextElement !== "#") {
          currentPosition = nextPosition;

          continue;
        }

        if (countStartVisited > numPos) {
          count = count + 1;
          break;
        }

        guard = getNewGuard(guard);
      }
    }
  }

  return count;
}

console.log("result1", countGridVisits(grid));
console.log("result2", countGridVisits2(grid));
