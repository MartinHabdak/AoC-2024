const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname);

const spaceWidth = rows.length > 12 ? 101 : 11;
const spaceHeight = rows.length > 12 ? 103 : 7;

const robots = rows.map((row) => {
  const [position, velocity] = row.split(" ");
  const [, posX, posY] = /(-?\d+),(-?\d+)/g.exec(position);
  const [, velX, velY] = /(-?\d+),(-?\d+)/g.exec(velocity);

  return {
    position: [Number(posX), Number(posY)],
    velocity: [Number(velX), Number(velY)],
  };
});

function updateRobot(robot) {
  robot.position[0] += robot.velocity[0];
  robot.position[1] += robot.velocity[1];

  if (robot.position[0] < 0) {
    robot.position[0] = spaceWidth + robot.position[0];
  } else if (robot.position[0] > spaceWidth - 1) {
    robot.position[0] = robot.position[0] - spaceWidth;
  }

  if (robot.position[1] < 0) {
    robot.position[1] = spaceHeight + robot.position[1];
  } else if (robot.position[1] > spaceHeight - 1) {
    robot.position[1] = robot.position[1] - spaceHeight;
  }
}

function hasTreeStars(map) {
  return Object.values(map).some((value) => value > 30);
}

function moveRobotsTree(robots) {
  let loop = true;
  let i = 100;

  while (loop) {
    const mapY = {};
    const mapX = {};

    for (const robot of robots) {
      updateRobot(robot);

      const [x, y] = robot.position;

      if (mapY[y] == null) {
        mapY[y] = 0;
      }

      if (mapX[x] == null) {
        mapX[x] = 0;
      }

      mapY[y]++;
      mapX[x]++;
    }

    if (hasTreeStars(mapY) && hasTreeStars(mapX)) {
      const arr = new Array(spaceHeight);

      for (let p = 0; p < spaceHeight; p++) {
        arr[p] = new Array(spaceWidth);
        arr[p].fill(" ");
      }

      for (const robot of robots) {
        arr[robot.position[1]][robot.position[0]] = "*";
      }

      for (let p = 0; p < spaceHeight; p++) {
        console.log(arr[p].join(""));
      }

      loop = false;
    }

    if (i > 9999) {
      console.log("No tree in data");

      return;
    }

    i++;
  }

  return i;
}

function moveRobots(seconds) {
  for (let i = 0; i < seconds; i++) {
    robots.forEach((robot) => updateRobot(robot));
  }
}

function getSafetyFactor(robots) {
  let q1 = 0;
  let q2 = 0;
  let q3 = 0;
  let q4 = 0;

  moveRobots(100);

  for (const robot of robots) {
    if (robot.position[0] < Math.floor(spaceWidth / 2)) {
      if (robot.position[1] < Math.floor(spaceHeight / 2)) {
        q1++;
      }

      if (robot.position[1] > Math.floor(spaceHeight / 2)) {
        q3++;
      }
    }

    if (robot.position[0] > Math.floor(spaceWidth / 2)) {
      if (robot.position[1] < Math.floor(spaceHeight / 2)) {
        q2++;
      }

      if (robot.position[1] > Math.floor(spaceHeight / 2)) {
        q4++;
      }
    }
  }

  return q1 * q2 * q3 * q4;
}

console.log("result1", getSafetyFactor(robots));
console.log("result2", moveRobotsTree(robots));
