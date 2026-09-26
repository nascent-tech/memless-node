'use strict';

const { native } = require('./library');
const cellValue = require('./cell-value');

function cell(result, row, column) {
  const holders = {
    integer: [0n],
    decimal: [0],
    boolean: [0],
    text: [null],
  };
  const kind = native.readCell(
    result, row, column,
    holders.integer, holders.decimal, holders.boolean, holders.text,
  );
  return cellValue(kind, holders);
}

module.exports = cell;
