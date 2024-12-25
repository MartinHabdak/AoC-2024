const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname);

const [list1, list2] = rows.reduce(
  (acc, line) => {
    const [accList1, accList2] = acc;
    const [id1, id2] = line.split(" ").filter((id) => id);

    return [
      [...accList1, Number(id1)],
      [...accList2, Number(id2)],
    ];
  },
  [[], []],
);

list1.sort();
list2.sort();

console.log(
  "result1",
  list1.reduce((acc, id1, i) => acc + Math.abs(id1 - list2[i]), 0),
);

console.log(
  "result2",
  list1.reduce((acc, id1) => {
    const count = list2.filter((id2) => id2 === id1).length;

    return acc + count * id1;
  }, 0),
);
