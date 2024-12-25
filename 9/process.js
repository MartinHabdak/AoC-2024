const { getInput } = require("../utils/input");

const [, , input] = getInput(__dirname, Number);

function calculateChecksum(disk) {
  return disk.reduce((acc, fileBlock, index) => {
    const number = Number(fileBlock);

    if (Number.isInteger(number)) {
      return acc + number * index;
    }

    return acc;
  }, 0);
}

function parseFile(file) {
  return file
    .split("")
    .reduce(
      (acc, fileIdOrSpace, index) => [
        ...acc,
        ...Array.from(new Array(Number(fileIdOrSpace)), () =>
          index % 2 === 0 ? index / 2 : ".",
        ),
      ],
      [],
    );
}

function parseFile2(file) {
  return file.split("").reduce(
    (acc, fileIdOrSpace, index) => [
      ...acc,
      {
        id: index % 2 === 0 ? index / 2 : ".",
        length: Number(fileIdOrSpace),
      },
    ],
    [],
  );
}

function getLastIndex(file, prevLastIndex) {
  let index = prevLastIndex - 1;

  for (let i = index; i >= 0; i--) {
    if (Number.isInteger(Number(file[i]))) {
      index = i;

      break;
    }
  }

  return index;
}

function sortFile(file) {
  let lastIndex = file.length;

  for (let i = 0; i < file.length; i++) {
    const fileIdOrSpace = file[i];

    if (fileIdOrSpace === "." && i < lastIndex) {
      lastIndex = getLastIndex(file, lastIndex);
      file[i] = file[lastIndex];
      file[lastIndex] = "#";
    }
  }

  return file;
}

function calculateChecksum2(disk) {
  return calculateChecksum(
    disk.reduce((acc, item) => {
      if (item.length === 0) {
        return acc;
      }

      return [...acc, ...Array.from(new Array(item.length), () => item.id)];
    }, []),
  );
}

function getLastIndex2(file, fil, filIndex) {
  let index = -1;

  for (let i = 0; i < file.length; i++) {
    const { id, length } = file[i];

    if (i >= filIndex) {
      break;
    }

    if (id === "." && length >= fil.length) {
      index = i;

      break;
    }
  }

  return index;
}

function sortFile2(file) {
  for (let i = file.length - 1; i >= 0 && i < file.length; i--) {
    const fil = { ...file[i] };
    const { id, length } = fil;

    if (id === ".") {
      continue;
    }

    const newLastIndex = getLastIndex2(file, fil, i);

    if (newLastIndex === -1) {
      continue;
    }

    const empty = { ...file[newLastIndex] };
    const { length: emptyLength } = empty;

    if (emptyLength === length) {
      file[newLastIndex] = fil;
      file[i] = empty;

      continue;
    }

    file.splice(newLastIndex, 0, fil);
    file[newLastIndex + 1] = { ...empty, length: empty.length - fil.length };
    file[i + 1] = { ...empty, length: fil.length };
  }

  return file;
}

console.log("result1", calculateChecksum(sortFile(parseFile(input))));
console.log("result2", calculateChecksum2(sortFile2(parseFile2(input))));
