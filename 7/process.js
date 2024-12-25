const { getInput } = require("../utils/input");
const { arrayToTileId } = require("../utils/grid");

const [rows] = getInput(__dirname);

function generate(perm, maxLen, currLen, list) {
  if (currLen === maxLen) {
    return perm;
  }

  for (let i = 0, len = perm.length; i < len; i++) {
    const currPerm = perm.shift();

    for (let j = 0; j < list.length; j++) {
      perm.push(currPerm.concat(list[j]));
    }
  }

  return generate(perm, maxLen, currLen + 1, list);
}

function getPermutations(list, maxLen) {
  const perm = list.map((val) => [val]);

  return generate(perm, maxLen, 1, list);
}

function solveEquations(data) {
  let sumVal = 0;

  for (let d of data) {
    const [val, ...eq] = d.split(": ").map((x) => x.trim());
    const resVal = Number(val);
    const nums = eq[0].split(" ").map(Number);
    const ops = getPermutations(["*", "+"], nums.length - 1);

    if (
      ops.some((op) => {
        const sum = nums.reduce((acc, num, index, arr) => {
          const nextNum = arr[index + 1];

          if (nextNum != null) {
            return eval(`${acc}${op[index]}${nextNum}`);
          }

          return acc;
        }, nums[0]);

        return resVal == sum;
      })
    ) {
      sumVal = sumVal + resVal;
    }
  }

  return sumVal;
}

function solveEquations2(data) {
  let sumVal = 0;

  for (let d of data) {
    const [val, ...eq] = d.split(": ").map((x) => x.trim());
    const resVal = Number(val);
    const nums = eq[0].split(" ").map(Number);
    const ops = getPermutations(["*", "+", "||"], nums.length - 1);

    if (
      ops.some((op) => {
        const sum = [...nums].reduce((acc, num, index, arr) => {
          const nextNum = arr[index + 1];

          if (nextNum != null) {
            const oper = op[index];

            if (oper === "||") {
              return Number(`${acc}${nextNum}`);
            }

            const r = eval(`${acc}${op[index]}${nextNum}`);

            if (r > resVal) {
              arr.splice(1);
            }

            return r;
          }

          return acc;
        }, nums[0]);

        return resVal == sum;
      })
    ) {
      sumVal = sumVal + resVal;
    }
  }

  return sumVal;
}

console.log("result1", solveEquations(rows));
console.log("result2", solveEquations2(rows));
