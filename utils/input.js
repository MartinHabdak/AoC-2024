const fs = require("fs");
const path = require("path");

function getInput(dirname, gridMap = (i) => i, fileName = "input1.txt") {
  const input = fs.readFileSync(path.resolve(dirname, `./${fileName}`), {
    encoding: "utf8",
    flag: "r",
  });
  const rows = input.split("\n");
  const grid = rows.map((row) => [...row].map(gridMap));

  return [rows, grid, input];
}

module.exports = { getInput };
