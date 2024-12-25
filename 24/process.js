const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname);

const [values, connections] = rows.reduce(
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
const numberOfInputBits = values.length / 2;
const gates = connections.map((connection) => {
  const [operators, value] = connection.split(" -> ");
  const [a, operator, b] = operators.split(" ");

  return { a, op: operator, b, output: value };
});

const startingValues = values.reduce((acc, value) => {
  const [id, val] = value.split(":");

  acc[id] = Number(val);

  return acc;
}, {});

function getWires(wires, startingValues) {
  return connections.reduce((acc, connection) => {
    const regAND = /(.*)( AND )(.*)/g;
    const regOR = /(.*)( OR )(.*)/g;
    const regXOR = /(.*)( XOR )(.*)/g;
    const [operators, value] = connection.split("->");
    const [, andOperand1, andOperator, andOperand2] =
      regAND.exec(operators) || [];
    const [, orOperand1, orOperator, orOperand2] = regOR.exec(operators) || [];
    const [, xorOperand1, xorOperator, xorOperand2] =
      regXOR.exec(operators) || [];

    if (andOperator) {
      return {
        ...acc,
        get [value.trim()]() {
          return this[andOperand1] && this[andOperand2.trim()];
        },
      };
    }

    if (orOperator) {
      return {
        ...acc,
        get [value.trim()]() {
          return this[orOperand1] || this[orOperand2.trim()];
        },
      };
    }

    return {
      ...acc,
      get [value.trim()]() {
        return this[xorOperand1] ^ this[xorOperand2.trim()];
      },
    };
  }, startingValues);
}

const wires = getWires(connections, startingValues);

function getNumber(wires) {
  while (Object.values(wires).some((wire) => wire == null)) {
    wires = getWires(connections, wires);
  }
  wires = getWires(connections, wires);
  wires = getWires(connections, wires);

  const binaryNumber = Object.keys(wires)
    .sort()
    .reduce((acc, wireKey) => {
      if (wireKey.split("")[0] === "z") {
        return acc + wires[wireKey];
      }

      return acc;
    }, "");

  return parseInt(binaryNumber.split("").reverse().join(""), 2);
}

const [wiresRaw, gatesRaw] = rows.reduce(
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

// check schemas for a full adder and a ripple-carry adder to see how gates are wired
// first level contains XOR and AND gates. XOR outputs to the SUM (XOR) gate. first level AND consume x and y directly and output to carry (OR) gate
// next level XOR produces the SUM and outputs to z
// next level AND consume first level XOR and carry from previous adder. outputs to carry (OR) input
// carry gate (OR) outputs carry to the next adder

function isOutput(gate) {
  return gate.output[0] == "z";
}

function isGateType(gate, type) {
  return gate.op == type;
}

function hasGateOutput(gate, output) {
  return gate.output === output;
}

function hasGateInput(gate, input) {
  return gate.a === input || gate.b === input;
}

function isDirectGate(gate) {
  return gate.a[0] === "x" || gate.b[0] === "x";
}

//gates which need to be checked
const wrongGateCandidates = new Set();

//first level gates in a full adder are XORs and consume input directly
const fullAdderFirstGates = gates
  .filter(isDirectGate)
  .filter((item) => isGateType(item, "XOR"));

//all other XOR gates produce the sum (output to z) and are not direct gates
const fullAdderSUMGates = gates
  .filter((item) => isGateType(item, "XOR"))
  .filter((gate) => !isDirectGate(gate));

//all output gates
const outputGates = gates.filter(isOutput);

//all OR gates
const fullAdderORGates = gates.filter((item) => isGateType(item, "OR"));

//check all first level gates. they should be a XOR in a full adder architecture. theres an exception for the first bit which has direct x input and outputs to z directly. the reason is, that the first bit is not a full adder, as it doesnt consume a carry
function checkFirstGates() {
  fullAdderFirstGates.forEach((gate) => {
    const { a, b, output } = gate;

    const isFirstAdder = a === "x00" || b === "x00";

    if (isFirstAdder) {
      //first adder needs to output the first bit. if its not doing that, it needs to be swapped
      if (output !== "z00") {
        wrongGateCandidates.add(output);
      }

      return;
    }

    //if not first, and outputs to first bit, then needs to be swapped
    if (output == "z00") {
      wrongGateCandidates.add(output);
    }

    //if the gate outputs directly to output, then it needs to be swapped
    if (isOutput(gate)) {
      wrongGateCandidates.add(output);
    }
  });
}

//all other XOR gates nedd to produce the sum, and are not direct gates, should output their value to output z
function checkSUMGates() {
  fullAdderSUMGates.forEach((gate) => {
    // if its an indirect XOR, it needs to output its SUM value to z
    if (!isOutput(gate)) {
      wrongGateCandidates.add(gate.output);
    }
  });
}

//check gates that output a value to the z bit (do the SUM) or produce a carry for the next adder. they should be XOR or OR only. if they are not, they are misplaced
function checkOutputGates() {
  outputGates.forEach((gate) => {
    if (gate.output === `z${numberOfInputBits}`) {
      // if its the last bit, it should be an OR
      if (gate.op !== "OR") {
        wrongGateCandidates.add(gate.output);
      }
    } else if (gate.op !== "XOR") {
      // if its not the last bit, it needs to be a XOR
      wrongGateCandidates.add(gate.output);
    }
  });
}

//all first level gates have to output to SUM gates execpt for the first bit (half adder)
function checkFirstLevelXORtoSUMGate() {
  fullAdderFirstGates.forEach((gate) => {
    const { a, output } = gate;

    //skip the XOR gate of the first half adder which outputs directly to first z bit
    if (output === "z00") {
      return;
    }

    const doesOutputToSomeSUMGate = fullAdderSUMGates.some((item) =>
      hasGateInput(item, output),
    );

    if (!doesOutputToSomeSUMGate) {
      wrongGateCandidates.add(output);

      //find SUM gate
      const sumZOutput = `z${a.slice(1)}`;
      const sumGateWithZ = fullAdderSUMGates.find((item) =>
        hasGateOutput(item, sumZOutput),
      );

      if (sumGateWithZ) {
        //check if the inputs of the SUM gate are a carry from a previous adder
        const orMatch = fullAdderORGates.find((gate) =>
          [sumGateWithZ.a, sumGateWithZ.b].includes(gate.output),
        );
        if (orMatch) {
          //the other input which is not the carry is the input which should be the original output of the first level XOR gate
          const switchedOutput = [sumGateWithZ.a, sumGateWithZ.b].find(
            (out) => out !== orMatch.output,
          );
          wrongGateCandidates.add(switchedOutput);
        }
      }
    }
  });
}

function getSwaps() {
  checkFirstGates();
  checkSUMGates();
  checkOutputGates();
  checkFirstLevelXORtoSUMGate();

  return [...wrongGateCandidates].sort((a, b) => a.localeCompare(b)).join(",");
}

console.log("result1", getNumber(wires));
console.log("result2", getSwaps());
