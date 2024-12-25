const { directions, getNeighbors } = require("../utils/grid");

function bfs(graph, start) {
  const queue = [start];
  const visited = new Set();
  const result = [];

  while (queue.length) {
    const vertex = queue.shift();

    if (!visited.has(vertex)) {
      visited.add(vertex);
      result.push(vertex);

      for (const neighbor of graph[vertex]) {
        queue.push(neighbor);
      }
    }
  }

  return result;
}

function dijkstra(graph, start, end, getDistance) {
  const distances = {};
  const parents = { [end]: [] };
  const nodes = Object.keys(graph);
  let visited = new Set();

  for (let node of nodes) {
    distances[node] = { distance: Infinity };
    parents[node] = [];
  }

  distances[start] = { distance: 0 };

  while (nodes.length) {
    nodes.sort((a, b) => distances[a].distance - distances[b].distance);

    const closestNode = nodes.shift();

    if (distances[closestNode].distance === Infinity) {
      break;
    }

    visited.add(closestNode);

    for (let neighbor in graph[closestNode]) {
      if (!visited.has(neighbor)) {
        const newDistance = distances[closestNode].distance + getDistance();

        if (newDistance < distances[neighbor].distance) {
          distances[neighbor].distance = newDistance;
          parents[neighbor] = [closestNode];
        }
      }
    }
  }

  return [distances, parents];
}

function getGraph(grid) {
  const graph = {};

  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];

    for (let x = 0; x < row.length; x++) {
      const item = row[x];
      const neighbors = getNeighbors(grid, y, x);
      const node = `${y}|${x}`;

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
        }
      });
    }
  }

  return graph;
}

function aStar(start, end, bariers, maxX, maxY) {
  const path = {};
  const gScore = {};
  const fScore = {};
  let queue = [start];

  gScore[start] = 0;
  fScore[start] = Math.abs(end[0] - start[0]) + Math.abs(end[1] - start[1]);

  while (queue.length > 0) {
    let current = queue.reduce((min, a) => (fScore[a] < fScore[min] ? a : min));

    if (current[0] === end[0] && current[1] === end[1]) {
      break;
    }

    queue = queue.filter((a) => a !== current);

    for (let direction of directions) {
      let nextPoint = [current[0] + direction[0], current[1] + direction[1]];

      if (
        !bariers[[nextPoint[0], nextPoint[1]]] &&
        maxX > nextPoint[0] &&
        nextPoint[0] >= 0 &&
        maxY > nextPoint[1] &&
        nextPoint[1] >= 0
      ) {
        let tentativeGScore = gScore[current] + 1;

        if (!path[nextPoint] || tentativeGScore < gScore[nextPoint]) {
          path[nextPoint] = current;
          gScore[nextPoint] = tentativeGScore;
          fScore[nextPoint] =
            gScore[nextPoint] +
            Math.abs(end[0] - nextPoint[0]) +
            Math.abs(end[1] - nextPoint[1]);

          if (!queue.includes(nextPoint)) {
            queue.push(nextPoint);
          }
        }
      }
    }
  }

  return path;
}

module.exports = { aStar, bfs, dijkstra, getGraph };
