const { bfs, dijkstra, getGraph } = require("../utils/graph");
const {
  arrayToTileId,
  getStartAndEnd,
  tileIdToArray,
} = require("../utils/grid");
const { getInput } = require("../utils/input");

const [rows, grid] = getInput(__dirname);
const graph = getGraph(grid);
const [start, end] = getStartAndEnd(grid);
const startId = arrayToTileId(start);
const endId = arrayToTileId(end);
const [dijkstraResult, pathNoCheat] = dijkstra(
  graph,
  startId,
  endId,
  getDistance,
);
const path = bfs(pathNoCheat, endId).reverse();

function getDistance(node1, node2, grid, visited) {
  return 1;
}

function getCheatDistance(grid, y, x, depth, cheatMap) {
  const distanceNoCheat = dijkstraResult[endId].distance;
  let minP = Math.max(y - depth, 1);
  let maxP = Math.min(y + depth, grid.length - 2);

  for (minP; minP <= maxP; minP++) {
    let minQ = Math.max(x - depth, 1);
    let maxQ = Math.min(x + depth, grid[minP].length - 2);
    for (minQ; minQ <= maxQ; minQ++) {
      const tile = grid[minP][minQ];

      if (tile !== "#" && tile !== "S" && (minP !== y || minQ !== x)) {
        const cachedDistanceInIt = dijkstraResult[`${minP}|${minQ}`];
        const cachedDistanceInEnd = dijkstraResult[endId];
        const oldDist = dijkstraResult[`${y}|${x}`];
        const gridDistance = Math.abs(y - minP) + Math.abs(x - minQ);

        if (
          cachedDistanceInIt.distance > cachedDistanceInEnd.distance ||
          oldDist.distance > cachedDistanceInIt.distance ||
          gridDistance > depth
        ) {
          continue;
        }

        const shortenedBy =
          cachedDistanceInIt.distance - oldDist.distance - gridDistance;

        if (!cheatMap[shortenedBy]) {
          cheatMap[shortenedBy] = 0;
        }

        cheatMap[shortenedBy]++;
      }
    }
  }
}

function calculate(grid, graph, depth) {
  const cheatMap = {};

  for (let i = 0; i < path.length - 1; i++) {
    const [y, x] = tileIdToArray(path[i]);

    getCheatDistance(grid, Number(y), Number(x), depth, cheatMap);
  }

  return Object.keys(cheatMap).reduce((acc, key) => {
    if (Number(key) >= 100) {
      return acc + cheatMap[key];
    }

    return acc;
  }, 0);
}

console.log("result1", calculate(grid, graph, 2));
console.log("result2", calculate(grid, graph, 20));
