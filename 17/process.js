const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname, undefined, "input.txt");
const [rows2] = getInput(__dirname, undefined, "input2.txt");

function loadProgram(rows) {
  const regA = BigInt(parseInt(rows[0].split(": ")[1]));
  const regB = BigInt(parseInt(rows[1].split(": ")[1]));
  const regC = BigInt(parseInt(rows[2].split(": ")[1]));

  return [
    rows[4]
      .split(": ")[1]
      .split(",")
      .map((x) => Number(x)),
    { regA, regB, regC },
  ];
}

function getComboOperand(op, reg) {
  if (op === 4n) {
    return reg.regA;
  }

  if (op === 5n) {
    return reg.regB;
  }

  if (op === 6n) {
    return reg.regC;
  }

  return op;
}

function in0(op, reg) {
  const comboOp = getComboOperand(op, reg);
  const number = reg.regA;
  const denom = 2n ** comboOp;

  reg.regA = BigInt(Math.floor(Number(number / denom)));
}

function in1(op, reg) {
  reg.regB = reg.regB ^ op;
}

function in2(op, reg) {
  const comboOp = getComboOperand(op, reg);

  reg.regB = comboOp % 8n;
}

function in3(op, reg) {
  if (reg.regA) {
    if (op <= program.length) {
      reg.instPointer = op - 2n;
    }
  }
}

function in4(op, reg) {
  reg.regB = reg.regB ^ reg.regC;
}

function in5(op, reg) {
  const compoOp = getComboOperand(op, reg);
  const result = compoOp % 8n;

  String(result)
    .split("")
    .forEach((char) => reg.output.push(char));
}

function in6(op, reg) {
  const comboOp = getComboOperand(op, reg);
  const number = reg.regA;
  const denom = 2n ** comboOp;

  reg.regB = Math.floor(number / denom);
}

function in7(op, reg) {
  const comboOp = getComboOperand(op, reg);
  const number = reg.regA;
  const denom = 2n ** comboOp;

  reg.regC = BigInt(Math.floor(Number(number / denom)));
}

const instructionSet = {
  0: in0,
  1: in1,
  2: in2,
  3: in3,
  4: in4,
  5: in5,
  6: in6,
  7: in7,
};

function runProgram(program, register) {
  const reg = { ...register, instPointer: 0n, output: [] };

  while (reg.instPointer < program.length) {
    instructionSet[program[reg.instPointer]](
      BigInt(program[reg.instPointer + 1n]),
      reg,
    );

    reg.instPointer += 2n;
  }

  return reg.output.join(",");
}

function runProgram2(program, register) {
  const queue = [[program.length - 1, 0n]];

  while (queue.length > 0) {
    const [offset, value] = queue.shift();

    for (let i = 0; i < 8; i++) {
      const nextValue = (value << 3n) + BigInt(i);
      const result = runProgram(program, {
        regA: nextValue,
        regB: 0n,
        regC: 0n,
      });

      if (result === program.slice(offset).join(",")) {
        if (offset === 0) {
          return nextValue;
        }

        queue.push([offset - 1, nextValue]);
      }
    }
  }
}

let [program, register] = loadProgram(rows);
console.log("result1", runProgram(program, register));

[program, register] = loadProgram(rows2);
console.log("result2", Number(runProgram2(program, register)));
