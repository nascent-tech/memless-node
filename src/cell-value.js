'use strict';

const koffi = require('koffi');
const { TEXT, INTEGER, DECIMAL, BOOLEAN } = require('./kind');
const integerCell = require('./integer-cell');

function cellValue(kind, holders) {
  if (kind === TEXT) {
    return koffi.decode(holders.text[0], 'char', -1);
  }
  if (kind === INTEGER) {
    return integerCell(holders.integer[0]);
  }
  if (kind === DECIMAL) {
    return holders.decimal[0];
  }
  if (kind === BOOLEAN) {
    return holders.boolean[0] !== 0;
  }
  return null;
}

module.exports = cellValue;
