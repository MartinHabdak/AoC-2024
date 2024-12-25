const { getInput } = require("../utils/input");
const { arrayToTileId } = require("../utils/grid");

const [rows, grid] = getInput(__dirname);

const nodes = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const directions = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

function isOutOfBounds(y, x) {
  return x < 0 || x >= grid[0].length || y < 0 || y >= grid.length;
}

function addAntinode(y, x, antinodes) {
  const node = arrayToTileId([y, x]);

  if (!isOutOfBounds(y, x) && !antinodes.includes(node)) {
    antinodes.push(node);
  }
}

function checkAntenna(y, x, antenna, antinodes) {
  directions.forEach((direction) => {
    const [iIncrement, jIncrement] = direction;

    for (let i = y + iIncrement; i >= 0 && i < grid.length; i += iIncrement) {
      for (
        let j = x + jIncrement;
        j >= 0 && j <= grid[i].length;
        j += jIncrement
      ) {
        if (grid[i][j] === antenna) {
          addAntinode(i + (i - y), j + (j - x), antinodes);
        }
      }
    }
  });
}

function calculateAntiNodes(grid, checkFn) {
  const antinodes = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (nodes.includes(grid[y][x])) {
        checkFn(y, x, grid[y][x], antinodes);
      }
    }
  }

  return antinodes.length;
}

function addAntinode2(y, x, diffY, diffX, antinodes) {
  let i = 0;

  while (true) {
    const a = y + i * diffY;
    const b = x + i * diffX;

    if (isOutOfBounds(a, b)) {
      break;
    }

    node = `${a}|${b}`;

    if (!antinodes.includes(node)) {
      antinodes.push(node);
    }

    i++;
  }
}

function checkAntenna2(y, x, antenna, antinodes) {
  for (let i = y + 1; i < grid.length; i++) {
    const row = grid[i];

    for (let j = x + 1; j <= row.length; j++) {
      if (row[j] === antenna) {
        addAntinode2(i, j, i - y, j - x, antinodes);
      }
    }
  }

  for (let i = y - 1; i >= 0; i--) {
    const row = grid[i];

    for (let j = x + 1; j <= row.length; j++) {
      if (row[j] === antenna) {
        addAntinode2(i, j, i - y, j - x, antinodes);
      }
    }
  }

  for (let i = y + 1; i < grid.length; i++) {
    const row = grid[i];

    for (let j = x - 1; j >= 0; j--) {
      if (j < 0) {
        break;
      }

      if (row[j] === antenna) {
        addAntinode2(i, j, i - y, j - x, antinodes);
      }
    }
  }

  for (let i = y - 1; i >= 0; i--) {
    const row = grid[i];

    for (let j = x - 1; j <= row.length; j--) {
      if (j < 0) {
        break;
      }

      if (row[j] === antenna) {
        addAntinode2(i, j, i - y, j - x, antinodes);
      }
    }
  }
}

console.log("result1", calculateAntiNodes(grid, checkAntenna));
console.log("result2", calculateAntiNodes(grid, checkAntenna2));
