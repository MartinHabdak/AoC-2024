const { getInput } = require("../utils/input");
const { arrayToTileId, getNeighbors, tileIdToArray } = require("../utils/grid");
const { bfs } = require("../utils/graph");

const [, grid] = getInput(__dirname);

function getNeighbors2(grid, y, x) {
  let leftY = y;
  let leftX = x - 1;
  let downY = y + 1;
  let downX = x;
  let rightY = y;
  let rightX = x + 1;
  let upY = y - 1;
  let upX = x;

  let leftUpY = y - 1;
  let leftUpX = x - 1;
  let leftDownY = y + 1;
  let leftDownX = x - 1;
  let rightUpY = y - 1;
  let rightUpX = x + 1;
  let rightDownY = y + 1;
  let rightDownX = x + 1;

  let left;
  let down;
  let right;
  let up;
  let leftUp;
  let leftDown;
  let rightUp;
  let rightDown;

  if (
    leftY >= 0 &&
    leftX >= 0 &&
    leftY < grid.length &&
    leftX < grid[leftY].length
  ) {
    left = grid[leftY][leftX];
  }

  if (
    downY >= 0 &&
    downX >= 0 &&
    downY < grid.length &&
    downX < grid[downY].length
  ) {
    down = grid[downY][downX];
  }

  if (
    rightY >= 0 &&
    rightX >= 0 &&
    rightY < grid.length &&
    rightX < grid[rightY].length
  ) {
    right = grid[rightY][rightX];
  }

  if (upY >= 0 && upX >= 0 && upY < grid.length && upX < grid[upY].length) {
    up = grid[upY][upX];
  }

  if (
    leftUpY >= 0 &&
    leftUpX >= 0 &&
    leftUpY < grid.length &&
    leftUpX < grid[leftUpY].length
  ) {
    leftUp = grid[leftUpY][leftUpX];
  }

  if (
    leftDownY >= 0 &&
    leftDownX >= 0 &&
    leftDownY < grid.length &&
    leftDownX < grid[leftDownY].length
  ) {
    leftDown = grid[leftDownY][leftDownX];
  }

  if (
    rightDownY >= 0 &&
    rightDownX >= 0 &&
    rightDownY < grid.length &&
    rightDownX < grid[rightDownY].length
  ) {
    rightDown = grid[rightDownY][rightDownX];
  }

  if (
    rightUpY >= 0 &&
    rightUpX >= 0 &&
    rightUpY < grid.length &&
    rightUpX < grid[rightUpY].length
  ) {
    rightUp = grid[rightUpY][rightUpX];
  }

  return [left, down, right, up, leftUp, leftDown, rightUp, rightDown];
}

function getGraph(grid) {
  const graph = {};
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];

    for (let x = 0; x < row.length; x++) {
      const item = row[x];
      const neighbors = getNeighbors(grid, y, x);

      neighbors.forEach(([j, i]) => {
        const neighborItem = grid[j][i];
        const node = arrayToTileId([y, x]);

        if (graph[node] == null) {
          graph[node] = [];
        }

        if (item === neighborItem) {
          const nextNode = arrayToTileId([j, i]);

          if (!graph[node].includes(nextNode)) {
            graph[node].push(nextNode);
          }

          if (graph[nextNode] == null) {
            graph[nextNode] = [];
          }

          if (!graph[nextNode].includes(node)) {
            graph[nextNode].push(node);
          }
        }
      });
    }
  }

  return graph;
}

function countCosts(graph) {
  let totalCost = 0;
  let procKeys = [];

  Object.keys(graph).forEach((key) => {
    if (procKeys.includes(key)) {
      return;
    }

    const area = bfs(graph, key);
    const numPlotsArea = area.reduce((acc, item) => {
      const plots = 4 - graph[item].length;

      procKeys = [...procKeys, ...graph[item]];

      return acc + plots;
    }, 0);

    totalCost += area.length * numPlotsArea;
  });

  return totalCost;
}

function countCosts2(graph, grid) {
  let totalCost = 0;
  let procKeys = [];

  Object.keys(graph).forEach((key) => {
    if (procKeys.includes(key)) {
      return;
    }

    const area = bfs(graph, key);
    const numEdgesArea = area.reduce((acc, key) => {
      const [y, x] = tileIdToArray(key);
      const [left, down, right, up, leftUp, leftDown, rightUp, rightDown] =
        getNeighbors2(grid, Number(y), Number(x));
      const item = grid[y][x];

      if (left !== item && up !== item) {
        acc++;
      }

      if (left !== item && down !== item) {
        acc++;
      }

      if (right !== item && up !== item) {
        acc++;
      }

      if (right !== item && down !== item) {
        acc++;
      }

      if (left === item && up === item && leftUp !== item) {
        acc++;
      }

      if (left === item && down === item && leftDown !== item) {
        acc++;
      }

      if (right === item && up === item && rightUp !== item) {
        acc++;
      }

      if (right === item && down === item && rightDown !== item) {
        acc++;
      }

      procKeys = [...procKeys, ...graph[key]];

      return acc;
    }, 0);

    totalCost += area.length * numEdgesArea;
  });

  return totalCost;
}

const graph = getGraph(grid);

console.log("result1", countCosts(graph));
console.log("result2", countCosts2(graph, grid));
