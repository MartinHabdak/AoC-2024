const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname);

const keyboard1 = {
  A: [2, 3],
  0: [1, 3],
  1: [0, 2],
  2: [1, 2],
  3: [2, 2],
  4: [0, 1],
  5: [1, 1],
  6: [2, 1],
  7: [0, 0],
  8: [1, 0],
  9: [2, 0],
};

const keyboard2 = {
  A: [2, 0],
  "^": [1, 0],
  ">": [2, 1],
  v: [1, 1],
  "<": [0, 1],
};

const keyboard2Directions = {
  "<": [-1, 0],
  ">": [1, 0],
  "^": [0, -1],
  v: [0, 1],
};

function memoize(fn) {
  const cache = {};

  return function (...args) {
    const key = JSON.stringify(args);

    if (!cache[key]) {
      cache[key] = fn.apply(this, args);
    }

    return cache[key];
  };
}

const shortestPath = memoize((x, y, dx, dy, depth) => {
  let result = null;
  const queue = [[x, y, ""]];

  while (queue.length > 0) {
    [x, y, path] = queue.shift();

    if (x === dx && y === dy) {
      result = getMinimum(result, shortestRobotPath(path + "A", depth - 1));
    } else if (x !== 0 || y !== 0) {
      Object.keys(keyboard2Directions).forEach((key) => {
        const [dirX, dirY] = keyboard2Directions[key];

        if (isValidMove(x, dx, dirX) || isValidMove(y, dy, dirY)) {
          queue.push([x + dirX, y + dirY, path + key]);
        }
      });
    }
  }

  return result;
});

const shortestRobotPath = memoize((path, depth) => {
  if (depth === 1) {
    return path.length;
  }

  let result = 0;
  let [x, y] = keyboard2["A"];

  for (const val of path) {
    const [dx, dy] = keyboard2[val];

    result += shortestPath(x, y, dx, dy, depth);
    [x, y] = [dx, dy];
  }

  return result;
});

function getMinimum(a, b) {
  return Math.min(...[a, b].filter((x) => x != null));
}

function isValidMove(start, end, change) {
  return (change < 0 && end < start) || (change > 0 && end > start);
}

function getShortestPath(x, y, dx, dy, depth) {
  let result;
  const queue = [[x, y, ""]];

  while (queue.length > 0) {
    [x, y, path] = queue.shift();

    if (x === dx && y === dy) {
      result = getMinimum(result, shortestRobotPath(path + "A", depth));
    } else if (x !== 0 || y !== 3) {
      Object.keys(keyboard2Directions).forEach((key) => {
        const [dirX, dirY] = keyboard2Directions[key];

        if (isValidMove(x, dx, dirX) || isValidMove(y, dy, dirY)) {
          queue.push([x + dirX, y + dirY, path + key]);
        }
      });
    }
  }

  return result;
}

function getSum(rows, depth) {
  let sum = 0;
  const pattern = /-?\d+/g;

  for (const row of rows) {
    let rowResult = 0;
    let [x, y] = keyboard1["A"];

    for (const button of row) {
      const [dx, dy] = keyboard1[button];

      rowResult += getShortestPath(x, y, dx, dy, depth);
      [x, y] = [dx, dy];
    }

    const rowNumber = Number(row.match(pattern)[0]);

    sum += rowResult * rowNumber;
  }

  return sum;
}

console.log("result1", getSum(rows, 3));
console.log("result2", getSum(rows, 26));
