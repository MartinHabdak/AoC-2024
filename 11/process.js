const { getInput } = require("../utils/input");

const [, , input] = getInput(__dirname);

const stones = input.split(" ");

function incrementCache(cache, newCache, newStone, stone) {
  if (newCache[newStone] == null) {
    newCache[newStone] = cache[stone];

    return;
  }

  newCache[newStone] = newCache[newStone] + cache[stone];
}

function splitStone(stone, cache, newCache) {
  if (stone === "0") {
    incrementCache(cache, newCache, 1, stone);

    return;
  }

  if (stone.length % 2 === 0) {
    const newStone1 = stone.slice(0, stone.length / 2);
    const newStone2 = stone.slice(stone.length / 2, stone.length);

    incrementCache(cache, newCache, newStone1, stone);
    incrementCache(cache, newCache, Number(newStone2), stone);

    return;
  }

  incrementCache(cache, newCache, Number(stone) * 2024, stone);
}

function tick(cache, newCache) {
  Object.keys(cache).forEach((key) => splitStone(key, cache, newCache));

  return [newCache, {}];
}

function countStones(stones, blinks) {
  let cache = stones.reduce((acc, stone) => ({ ...acc, [stone]: 1 }), {});
  let newCache = {};

  for (let i = 0; i < blinks; i++) {
    [cache, newCache] = tick(cache, newCache);
  }

  return Object.values(cache).reduce((acc, numStones) => acc + numStones, 0);
}

console.log("result1", countStones(stones, 25));
console.log("result2", countStones(stones, 75));
