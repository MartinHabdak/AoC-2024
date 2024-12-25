const { intersection } = require("../utils/array");
const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname);

function dfs(graph, node, path, paths) {
  if (
    path.length === 4 &&
    path[0] === node &&
    path.some((name) => name[0] === "t")
  ) {
    paths.push(path.slice(0, 3));
  }

  if (path.length >= 4) {
    return;
  }

  graph[node].forEach((neighbor) => {
    if (path.length < 4) {
      dfs(graph, neighbor, [...path, neighbor], paths);
    }
  });

  return;
}

function getGraph(lines) {
  const graph = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [comp1, comp2] = line.split("-");

    if (graph[comp1] == null) {
      graph[comp1] = [];
    }

    if (!graph[comp1].includes(comp2)) {
      graph[comp1].push(comp2);
    }

    if (graph[comp2] == null) {
      graph[comp2] = [];
    }

    if (!graph[comp2].includes(comp1)) {
      graph[comp2].push(comp1);
    }
  }

  return graph;
}

function getGroupsNumber(graph) {
  const groups = {};

  Object.keys(graph).forEach((node) => {
    const paths = [];
    const group = dfs(graph, node, [node], paths);

    paths.forEach((path) => {
      const key = path.sort().join(",");
      groups[key] = path.sort();
    });
  });

  return Object.keys(groups).length;
}

function bronKerbosch(R = [], P = [], X = [], graph, cliques) {
  if (!P.length && !X.length) {
    const sortedClique = R.sort();

    cliques[sortedClique.join(",")] = sortedClique;
  }

  P.forEach((v) => {
    bronKerbosch(
      [...R, v],
      [...intersection(P, graph[v])],
      [...intersection(X, graph[v])],
      graph,
      cliques,
    );
    P.pop(v);
    X.push(v);
  });
}

function getCliques(graph) {
    const cliques = {};

    bronKerbosch([], Object.keys(graph).sort(), [], graph, cliques);

    return cliques;
}

function getBiggestSet(graph) {
  const cliques = getCliques(graph);

  return Object.keys(cliques).sort((a, b) => b.length - a.length)[0];
}

const graph = getGraph(rows);

console.log("result1", getGroupsNumber(graph));
console.log("result2", getBiggestSet(graph));
