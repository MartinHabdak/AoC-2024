const { getInput } = require("../utils/input");

const [rows] = getInput(__dirname);

const [rulesInput, updatesInput] = rows.reduce(
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

const allRules = rulesInput.reduce(
  (acc, rule) => [...acc, rule.split("|").map(Number)],
  [],
);

const allUpdates = updatesInput.map((row) => row.split(",").map(Number));

const countMiddlePages = (updates) =>
  updates.reduce(
    (acc, pages) => acc + pages[Math.round((pages.length - 1) / 2)],
    0,
  );

const solve = (rules, updates) => {
  const correctUpdates = updates.filter((update) =>
    update.every((page) => {
      const pageRules = rules.filter((rule) => rule[0] === page);
      const indexOfPage = update.indexOf(page);

      return pageRules.every((rule) => {
        const indexOfRulePage = update.indexOf(rule[1]);

        if (indexOfRulePage < 0) {
          return true;
        }

        return indexOfPage < indexOfRulePage;
      });
    }),
  );

  const fixedUpdates = updates
    .filter((update) => correctUpdates.indexOf(update) === -1)
    .map((update) =>
      update.sort((page1, page2) => {
        const ruleBefore = rules.find(
          (rule) => rule[0] === page1 && rule[1] === page2,
        );
        const ruleAfter = rules.find(
          (rule) => rule[0] === page2 && rule[1] === page1,
        );

        if (ruleBefore) {
          return -1;
        }

        if (ruleAfter) {
          return 1;
        }

        return 0;
      }),
    );

  console.log("result1", countMiddlePages(correctUpdates));
  console.log("result2", countMiddlePages(fixedUpdates));
};

solve(allRules, allUpdates);
