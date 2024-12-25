function getNeighborsNoBorder(grid, y, x) {
  return [
    [y, x - 1],
    [y + 1, x],
    [y, x + 1],
    [y - 1, x],
  ].filter(
    ([y, x]) => y > 0 && x > 0 && y < grid.length - 1 && x < grid[y].length - 1,
  );
}

function getNeighbors(grid, y, x) {
  return [
    [y, x - 1],
    [y + 1, x],
    [y, x + 1],
    [y - 1, x],
  ].filter(
    ([y, x]) => y >= 0 && x >= 0 && y < grid.length && x < grid[y].length,
  );
}

function getStartAndEnd(grid) {
  let startY = 0;
  let startX = 0;
  let endY = 0;
  let endX = 0;

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "S") {
        startY = i;
        startX = j;
      }

      if (grid[i][j] === "E") {
        endY = i;
        endX = j;
      }
    }
  }

  return [
    [startY, startX],
    [endY, endX],
  ];
}

function tileIdToArray(tileId) {
  return tileId.split("|");
}

function arrayToTileId([y, x]) {
  return `${y}|${x}`;
}

function copyGrid(grid) {
  return grid.map((arr) => arr.slice());
}

const directions = [
  [0, -1],
  [0, 1],
  [-1, 0],
  [1, 0],
];

module.exports = {
  arrayToTileId,
  copyGrid,
  directions,
  getNeighbors,
  getNeighborsNoBorder,
  getStartAndEnd,
  tileIdToArray,
};
