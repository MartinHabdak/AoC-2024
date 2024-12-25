const { getInput } = require("../utils/input");
const { arrayToTileId, getNeighbors } = require("../utils/grid");

const [rows, grid] = getInput(__dirname, Number);

function isValid(current, neighbor) {
  return neighbor - current === 1;
}

function traverse(grid, y, x, visited, visitedEnd, score, checkVisited) {
  const current = grid[y][x];
  const neighbors = getNeighbors(grid, y, x);

  neighbors.forEach((neighbor) => {
    const [neighborY, neighborX] = neighbor;
    const neighborItem = grid[neighborY][neighborX];
    const neighborPos = arrayToTileId(neighbor);

    if (
      isValid(current, neighborItem) &&
      (!checkVisited || !visited.includes(neighborPos))
    ) {
      visited.push(neighborPos);

      if (
        neighborItem === 9 &&
        (!checkVisited || !visitedEnd.includes(neighborPos))
      ) {
        visitedEnd.push(neighborPos);
        score.score++;

        return score;
      }

      return traverse(
        grid,
        neighborY,
        neighborX,
        visited,
        visitedEnd,
        score,
        checkVisited,
      );
    }
  });

  return score;
}

function startPathFinding(grid, y, x, checkVisited) {
  const visited = [];
  const visitedEnd = [];
  const mutableScore = { score: 0 };

  return traverse(grid, y, x, visited, visitedEnd, mutableScore, checkVisited)
    .score;
}

function countTrailheads(grid, checkVisited) {
  let totalScore = 0;

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];

    for (let x = 0; x < row.length; x++) {
      const item = row[x];

      if (item === 0) {
        totalScore = totalScore + startPathFinding(grid, y, x, checkVisited);
      }
    }
  }

  return totalScore;
}

console.log("result1", countTrailheads(grid, true));
console.log("result2", countTrailheads(grid, false));
