const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname);

const [warehouseRows, robotMovesRows] = rows.reduce(
  (acc, row) => {
    if (row.length === 0) {
      return [acc[0], []];
    }

    const toPush = acc[acc.length - 1];

    toPush.push(row);

    return acc;
  },
  [[]],
);

const warehouse = warehouseRows.map((row) => [...row]);
const wideWarehouse = thickenWarehouse(warehouse);
const robotMoves = robotMovesRows.reduce((acc, row) => acc + row, "").split("");

function thickenWarehouse(warehouse) {
  return warehouse.map((row) =>
    row.reduce((acc, item) => {
      if (item === "@") {
        return [...acc, "@", "."];
      }

      if (item === "O") {
        return [...acc, "[", "]"];
      }

      return [...acc, item, item];
    }, []),
  );
}

const dy = [-1, 0, 1, 0];
const dx = [0, 1, 0, -1];

function getRobotNext(robotY, robotX, d, warehouse) {
  let nextY = robotY + dy[d];
  let nextX = robotX + dx[d];

  return [warehouse[nextY][nextX], [nextY, nextX]];
}

function getNearestEmpty(robotY, robotX, d, warehouse) {
  let nextY = robotY;
  let nextX = robotX;
  let inbetween = 0;

  while (
    nextY > 0 &&
    nextY < warehouse.length &&
    nextX > 0 &&
    nextX < warehouse[nextY].length
  ) {
    nextY = nextY + dy[d];
    nextX = nextX + dx[d];

    if (warehouse[nextY][nextX] === "#") {
      nextY = robotY;
      nextX = robotX;
      inbetween = 0;

      break;
    }

    if (warehouse[nextY][nextX] === ".") {
      break;
    }

    inbetween++;
  }

  return [inbetween, [nextY, nextX]];
}

function hasSpaceAfter(warehouse, items, d, inbetween, allItems) {
  let inb = inbetween;
  let nextItems = [];

  for (const item of items) {
    const itemArray = item.split("|");
    let nextY = Number(itemArray[0]);
    let nextX = Number(itemArray[1]);
    const itemBoxItem = warehouse[nextY][nextX];
    nextY = nextY + dy[d];
    nextX = nextX + dx[d];

    const nextBoxItem = warehouse[nextY][nextX];

    if (nextBoxItem === "#") {
      nextItems = [];
      inb = 0;
      break;
    }

    if (nextBoxItem === ".") {
      continue;
    }

    if (!nextItems.includes(`${nextY}|${nextX}`)) {
      nextItems.push(`${nextY}|${nextX}`);
    }

    if (nextBoxItem === "[" && !nextItems.includes(`${nextY}|${nextX + 1}`)) {
      nextItems.push(`${nextY}|${nextX + 1}`);
    }

    if (nextBoxItem === "]" && !nextItems.includes(`${nextY}|${nextX - 1}`)) {
      nextItems.push(`${nextY}|${nextX - 1}`);
    }
  }

  return nextItems.length
    ? hasSpaceAfter(warehouse, nextItems, d, inb + 1, [...allItems, nextItems])
    : [inb, allItems];
}

function updateRobotPosition(warehouse, robotY, robotX, nextY, nextX) {
  warehouse[robotY][robotX] = ".";
  warehouse[nextY][nextX] = "@";
}

function calculateSum(warehouse, boxChar) {
  let gpsSum = 0;

  for (let i = 0; i < warehouse.length; i++) {
    for (let j = 0; j < warehouse[i].length; j++) {
      if (warehouse[i][j] === boxChar) {
        gpsSum += 100 * i + j;
      }
    }
  }

  return gpsSum;
}

function solve(moves, warehouse) {
  let [robotY, robotX] = getRobotStart(warehouse);

  function moveRobot(d) {
    const [next, nextPosition] = getRobotNext(robotY, robotX, d, warehouse);
    const [nextY, nextX] = nextPosition;

    if (next === "#") {
      return;
    }

    if (next === ".") {
      updateRobotPosition(warehouse, robotY, robotX, nextY, nextX);
      robotY = nextY;
      robotX = nextX;

      return;
    }

    if (next === "O") {
      const [inbetween, emptyPosition] = getNearestEmpty(
        robotY,
        robotX,
        d,
        warehouse,
      );

      if (inbetween > 0) {
        const [emptyY, emptyX] = emptyPosition;

        warehouse[emptyY][emptyX] = "O";
        updateRobotPosition(warehouse, robotY, robotX, nextY, nextX);
        robotY = nextY;
        robotX = nextX;

        return;
      }
    }
  }

  for (let m of moves) {
    moveRobot({ "^": 0, ">": 1, v: 2, "<": 3 }[m]);
  }

  return calculateSum(warehouse, "O");
}

function getNearestEmptyRowWide(robotY, robotX, d, warehouse) {
  let nextY = robotY;
  let nextX = robotX;
  let inbetween = 0;

  while (
    nextY > 0 &&
    nextY < warehouse.length &&
    nextX > 0 &&
    nextX < warehouse[nextY].length
  ) {
    nextY = nextY + dy[d];
    nextX = nextX + dx[d];
    if (warehouse[nextY][nextX] === "#") {
      nextY = robotY;
      nextX = robotX;
      inbetween = 0;
      break;
    }

    if (warehouse[nextY][nextX] === ".") {
      break;
    }

    inbetween++;
  }

  return [inbetween, [nextY, nextX]];
}

function getRobotStart(warehouse) {
  let robotY = 0;
  let robotX = 0;

  for (let i = 0; i < warehouse.length; i++) {
    for (let j = 0; j < warehouse[i].length; j++) {
      if (warehouse[i][j] === "@") {
        robotY = i;
        robotX = j;
      }
    }
  }

  return [robotY, robotX];
}

function solve2(moves, warehouse) {
  let [robotY, x_robot] = getRobotStart(warehouse);

  function moveRobot(d) {
    const [next, nextPosition] = getRobotNext(robotY, x_robot, d, warehouse);
    const [nextY, nextX] = nextPosition;

    if (next === "#") {
      return;
    }

    if (next === ".") {
      updateRobotPosition(warehouse, robotY, x_robot, nextY, nextX);
      robotY = nextY;
      x_robot = nextX;

      return;
    }

    if ((next === "[" || next === "]") && (d === 1 || d === 3)) {
      const [inbetween, emptyPosition] = getNearestEmptyRowWide(
        robotY,
        x_robot,
        d,
        warehouse,
      );

      if (inbetween > 0) {
        const [emptyY, emptyX] = emptyPosition;
        let [current, currentPosition] = [next, nextPosition];

        for (let p = 0; p < inbetween; p++) {
          const [nextCurrent, nextCurrentPosition] = getRobotNext(
            currentPosition[0],
            currentPosition[1],
            d,
            warehouse,
          );

          warehouse[nextCurrentPosition[0]][nextCurrentPosition[1]] = current;
          current = nextCurrent;
          currentPosition = nextCurrentPosition;
        }

        updateRobotPosition(warehouse, robotY, x_robot, nextY, nextX);
        robotY = nextY;
        x_robot = nextX;
        return;
      }
    }

    if ((next === "[" || next === "]") && (d === 0 || d === 2)) {
      const [inbetween, toBeMoved] = hasSpaceAfter(
        warehouse,
        [`${robotY}|${x_robot}`],
        d,
        0,
        [],
      );

      if (inbetween > 0) {
        toBeMoved.reverse().forEach((row) => {
          row.forEach((item) => {
            const [itemY, itemX] = item.split("|").map(Number);
            const [, pos] = getRobotNext(itemY, itemX, d, warehouse);
            const [newY, newX] = pos;
            warehouse[newY][newX] = warehouse[itemY][itemX];
            warehouse[itemY][itemX] = ".";
          });
        });
        updateRobotPosition(warehouse, robotY, x_robot, nextY, nextX);
        robotY = nextY;
        x_robot = nextX;
        return nextPosition;
      }
    }

    return;
  }

  for (const m of moves) {
    moveRobot({ "^": 0, ">": 1, v: 2, "<": 3 }[m]);
  }

  return calculateSum(warehouse, "[");
}

console.log("result1", solve(robotMoves, warehouse));
console.log("result2", solve2(robotMoves, wideWarehouse));
