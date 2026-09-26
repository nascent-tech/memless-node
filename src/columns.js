'use strict';

const { native } = require('./library');

function columns(result) {
  const count = Number(native.columnCount(result));
  return Array.from({ length: count }, (_, index) => native.columnName(result, index));
}

module.exports = columns;
