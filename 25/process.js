const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname);

const keysAndLocks = rows.reduce(
  (acc, row, i) => {
    const toPush = acc[acc.length - 1];

    if (row.length === 0) {
        const grid = toPush.map((r) => [...r]);

        acc.pop();

        return [...acc, grid, []];
    }

    if (i === rows.length - 1) {
        toPush.push(row);
        const grid = toPush.map((r) => [...r]);

        acc.pop();

        return [...acc, grid];
    }

    toPush.push(row);

    return acc;
  },
  [[]],
);

function getHeight(keyOrLock, char) {
    const height = [];

    for(let x = 0; x < keyOrLock[0].length; x++) {
        const column = [];

        for(let y = 0; y < keyOrLock.length; y++) {
            column.push(keyOrLock[y][x]);
        }

        height.push(column.filter((item) => item === char).length - 1);
    }

    return height;
}

const [locks, keys] = keysAndLocks.reduce((acc, keyOrLock) => {
    if (keyOrLock[0].every((char) => char === '#')) {
        acc[0].push(getHeight(keyOrLock, '#'));
    } else {
        acc[1].push(getHeight(keyOrLock, '#'));
    }

    return acc;
}, [[], []]);

function isOverlapping(lock, key) {
    return lock.some((height, i) =>
        (height + key[i]) > 5
    );
}

function getNumberOfPairs(locks, keys) {
    let overlapping = 0;

    locks.forEach((lock) => {
        keys.forEach((key) => {
           if (isOverlapping(lock, key)) {
               overlapping++;
           }
        });
    });

    return (locks.length * keys.length) - overlapping;
}

console.log('result1', getNumberOfPairs(locks, keys));

