'use strict';

const { native } = require('./library');
const row = require('./row');

function records(result, width) {
  const count = Number(native.rowCount(result));
  return Array.from({ length: count }, (_, index) => row(result, index, width));
}

module.exports = records;
