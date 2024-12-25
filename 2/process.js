const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname);

const isAsc = (levels) =>
  levels.every(
    (level, i) =>
      i == 0 || (level > levels[i - 1] && level - levels[i - 1] < 4),
  );

const isDesc = (levels) =>
  levels.every(
    (level, i) =>
      i == 0 || (level < levels[i - 1] && levels[i - 1] - level < 4),
  );

const isSafe = (report) => {
  const levels = report.split(" ").map(Number);

  return isAsc(levels) || isDesc(levels);
};

const isSafe2 = (report) => {
  const levels = report.split(" ").map(Number);
  const levelCombinations = levels.reduce(
    (acc, level, i) => {
      const combination = levels.filter((level, index) => index != i);

      return [...acc, combination];
    },
    [levels],
  );

  return levelCombinations.some(
    (combination) => isAsc(combination) || isDesc(combination),
  );
};

const analyzeLevels = (data, isSafe) => data.filter(isSafe).length;

console.log("result1", analyzeLevels(rows, isSafe));
console.log("result2", analyzeLevels(rows, isSafe2));
