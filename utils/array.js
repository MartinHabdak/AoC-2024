function intersection(array1, array2) {
  return array1.filter((n) => array2.indexOf(n) !== -1);
}

module.exports = { intersection };
