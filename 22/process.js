const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname);
const [rows2] = getInput(__dirname, undefined, "input2.txt");

function mix(number, number2) {
  return (number ^ number2) >>> 0;
}

function prune(number) {
  return number % 16777216;
}

function tickNumber(number) {
  number = prune(mix(number, number << 6));
  number = prune(mix(number, Math.floor(number >> 5)));
  number = prune(mix(number, number << 11));

  return number;
}

function calculateSecret(number) {
  for (let i = 0; i < 2000; i++) {
    number = tickNumber(number);
  }

  return number;
}

function calculateTotal(monkeys) {
  let total = 0;

  monkeys.forEach((monkey) => (total += calculateSecret(monkey)));

  return total;
}

function getMonkeyPrices(number) {
  const prices = [number % 10];
  const diffs = [0];

  for (let i = 1; i < 2001; i++) {
    number = tickNumber(number);
    prices.push(number % 10);
    diffs.push(prices[i] - prices[i - 1]);
  }

  return [prices, diffs];
}

function calculateBananas(monkeys) {
  const results = {};

  monkeys.forEach((monkey) => {
    const checked = {};
    const [prices, diffs] = getMonkeyPrices(monkey);

    for (let i = 4; i < diffs.length; i++) {
      const key = `${diffs[i - 3]}${diffs[i - 2]}${diffs[i - 1]}${diffs[i]}`;

      if (checked[key] !== monkey) {
        checked[key] = monkey;

        if (results[key] == null) {
          results[key] = 0;
        }

        results[key] += prices[i];
      }
    }
  });

  return Math.max(...Object.values(results));
}

console.log("result1", calculateTotal(rows));
console.log("result2", calculateBananas(rows2));
