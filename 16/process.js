const { getInput } = require("../utils/input");
const { bfs } = require("../utils/graph");
const {
  arrayToTileId,
  getNeighborsNoBorder,
  getStartAndEnd,
} = require("../utils/grid");

const [rows, grid] = getInput(__dirname);
const directions = { "^": 0, ">": 1, v: 2, "<": 3 };

function getGraph(grid) {
  const graph = {};

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];

    for (let x = 0; x < row.length; x++) {
      const item = row[x];
      const neighbors = getNeighborsNoBorder(grid, y, x);
      const node = arrayToTileId([y, x]);

      if (item === "#") {
        continue;
      }

      neighbors.forEach(([j, i]) => {
        const neighborItem = grid[j][i];

        if (graph[node] == null) {
          graph[node] = {};
        }

        if (neighborItem && neighborItem !== "#") {
          const nextNode = `${j}|${i}`;

          graph[node][nextNode] = { distance: Infinity, parent: null };

          if (graph[nextNode] == null) {
            graph[nextNode] = {};
          }

          graph[nextNode][node] = { distance: Infinity, parent: null };
        }
      });
    }
  }

  return graph;
}

function getDistance(closestNode, neighbor, currentOrientation) {
  let direction = currentOrientation;
  let distance = 1;

  const [closestY, closestX] = closestNode.split("|");
  const [neighborY, neighborX] = neighbor.split("|");
  if (currentOrientation === false) {
    if (closestY != neighborY) {
      distance = 1001;
      direction = !direction;
    }
  }
  if (currentOrientation === true) {
    if (closestX != neighborX) {
      distance = 1001;
      direction = !direction;
    }
  }

  return [distance, direction];
}

function dijkstra(
  graph,
  start,
  end,
  startDistance = 0,
  startOrientation = false,
  avoid,
) {
  let distances = {};
  let parents = { [end]: [] };
  let nodes = Object.keys(graph);
  let visited = new Set();

  for (let node of nodes) {
    distances[node] = { distance: Infinity };
    parents[node] = [];
  }

  distances[start] = { distance: startDistance, orientation: startOrientation };

  while (nodes.length) {
    nodes.sort((a, b) => {
      if (
        distances[a].distance === Infinity &&
        distances[b].distance === Infinity
      ) {
        return Infinity;
      }

      return distances[a].distance - distances[b].distance;
    });
    let closestNode = nodes.shift();

    if (distances[closestNode].distance === Infinity) {
      break;
    }

    let currentOrientation = distances[closestNode].orientation;

    visited.add(closestNode);

    if (closestNode === end) {
      break;
    }

    for (let neighbor in graph[closestNode]) {
      if (neighbor !== avoid) {
        const [neighborDistance, newOrientation] = getDistance(
          closestNode,
          neighbor,
          currentOrientation,
        );

        let newDistance = distances[closestNode].distance + neighborDistance;

        if (newDistance < distances[neighbor].distance) {
          distances[neighbor].distance = newDistance;
          distances[neighbor].orientation = newOrientation;
          parents[neighbor] = [closestNode];

          continue;
        }
      }
    }
  }

  return [distances, parents];
}

const graph = getGraph(grid);
const [[startY, startX], [endY, endX]] = getStartAndEnd(grid);

function getTrackLength(graph, startY, startX, endY, endX) {
  return dijkstra(
    graph,
    arrayToTileId([startY, startX]),
    arrayToTileId([endY, endX]),
  )[0][arrayToTileId([endY, endX])].distance;
}

function getTilesNumber(graph, startY, startX, endY, endX) {
  const [distances, parents] = dijkstra(
    graph,
    arrayToTileId([startY, startX]),
    arrayToTileId([endY, endX]),
  );
  const endTileId = arrayToTileId([endY, endX]);
  const path = bfs(parents, endTileId).reverse();
  const allOtherPaths = [];

  path.forEach((tile) => {
    const neighbors = graph[tile];

    if (tile !== endTileId) {
      for (let neighbor in graph[tile]) {
        if (!path.includes(neighbor)) {
          const [neighborDistance, newOrientation] = getDistance(
            tile,
            neighbor,
            distances[tile].orientation,
          );

          let newDistance = distances[tile].distance + neighborDistance;

          allOtherPaths.push(
            dijkstra(
              graph,
              neighbor,
              arrayToTileId([endY, endX]),
              newDistance,
              newOrientation,
              tile,
            ),
          );
        }
      }
    }
  });

  const shortestPaths = allOtherPaths.filter((p) => {
    return (
      p[0][arrayToTileId([endY, endX])].distance ===
      distances[arrayToTileId([endY, endX])].distance
    );
  });

  const uniqueTiles = new Set();

  path.forEach((tile) => {
    uniqueTiles.add(tile);
  });

  shortestPaths.forEach((short) => {
    const path = bfs(short[1], endTileId).reverse();

    path.forEach((tile) => {
      uniqueTiles.add(tile);
    });
  });

  return uniqueTiles.size;
}

console.log("result1", getTrackLength(graph, startY, startX, endY, endX));
console.log("result2", getTilesNumber(graph, startY, startX, endY, endX));
