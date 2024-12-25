const { getInput } = require("../utils/input");

const [rows, grid] = getInput(__dirname);

function rotateMatrix90C(source) {
  const M = source.length;
  const N = source[0].length;

  let destination = new Array(N);

  for (let i = 0; i < N; i++) {
    destination[i] = new Array(M);
  }

  for (let i = 0; i < N; i++) {
    for (let j = 0; j < M; j++) {
      destination[i][j] = source[M - j - 1][i];
    }
  }

  return destination;
}

function getDiagonals(m) {
  const diagonals = [];

  for (let i = 0; i < m.length; i++) {
    let diadonal = [];

    for (let y = i, x = 0; y >= 0; y--, x++) {
      diadonal.push(m[y][x]);
    }
    diagonals.push(diadonal);
  }

  for (let i = 1; i < m[0].length; i++) {
    let diadonal = [];

    for (let y = m.length - 1, x = i; x < m[0].length; y--, x++) {
      diadonal.push(m[y][x]);
    }

    diagonals.push(diadonal);
  }

  return diagonals;
}

function countXmas(rows, grid) {
  let count = 0;

  const horizontal = rows.reduce((acc, line) => {
    const count = (line.match(/XMAS/g) || []).length;
    const count2 = (line.match(/SAMX/g) || []).length;

    return acc + count + count2;
  }, 0);

  const verticalRotatedLines = rotateMatrix90C(grid);

  const vertical = verticalRotatedLines.reduce((acc, line) => {
    var count = (line.join("").match(/XMAS/g) || []).length;
    var count2 = (line.join("").match(/SAMX/g) || []).length;

    return acc + count + count2;
  }, 0);

  const diag1 = getDiagonals(grid);
  const diag2 = getDiagonals(verticalRotatedLines);

  const diag1count = diag1.reduce((acc, line) => {
    var count = (line.join("").match(/XMAS/g) || []).length;
    var count2 = (line.join("").match(/SAMX/g) || []).length;

    return acc + count + count2;
  }, 0);

  const diag2count = diag2.reduce((acc, line) => {
    var count = (line.join("").match(/XMAS/g) || []).length;
    var count2 = (line.join("").match(/SAMX/g) || []).length;

    return acc + count + count2;
  }, 0);

  return horizontal + vertical + diag1count + diag2count;
}

function countX_MAS(grid) {
  let count = 0;

  for (let i = 0; i < grid.length; i++) {
    const row = grid[i];

    for (let j = 0; j < row.length; j++) {
      const char = row[j];

      if (char === "X" || char === "A") {
        continue;
      }

      const nextChar = row[j + 2];

      if (!nextChar) {
        continue;
      }

      if (char === "M") {
        if (nextChar !== "M" && nextChar !== "S") {
          continue;
        }

        const middleRow = grid[i + 1];

        if (!middleRow) {
          continue;
        }

        const middleChar = grid[i + 1][j + 1];

        if (!middleChar || middleChar !== "A") {
          continue;
        }

        const lastRow = grid[i + 2];

        if (!lastRow) {
          continue;
        }

        const lastChar = grid[i + 2][j];
        const lastNextChar = grid[i + 2][j + 2];

        if (!lastChar || !lastNextChar) {
          continue;
        }

        if (lastNextChar !== "S") {
          continue;
        }

        if (nextChar === "M" && lastChar !== "S") {
          continue;
        }

        if (nextChar === "S" && lastChar !== "M") {
          continue;
        }

        count = count + 1;
      }

      if (char === "S") {
        if (nextChar !== "M" && nextChar !== "S") {
          continue;
        }

        const middleRow = grid[i + 1];

        if (!middleRow) {
          continue;
        }

        const middleChar = grid[i + 1][j + 1];

        if (!middleChar || middleChar !== "A") {
          continue;
        }

        const lastRow = grid[i + 2];

        if (!lastRow) {
          continue;
        }

        const lastChar = grid[i + 2][j];
        const lastNextChar = grid[i + 2][j + 2];

        if (!lastChar || !lastNextChar) {
          continue;
        }

        if (lastNextChar !== "M") {
          continue;
        }

        if (nextChar === "M" && lastChar !== "S") {
          continue;
        }

        if (nextChar === "S" && lastChar !== "M") {
          continue;
        }

        count = count + 1;
      }
    }
  }

  return count;
}

console.log("result1", countXmas(rows, grid));
console.log("result2", countX_MAS(grid));
