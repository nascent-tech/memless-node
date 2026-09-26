'use strict';

const cell = require('./cell');

function row(result, index, width) {
  return Array.from({ length: width }, (_, column) => cell(result, index, column));
}

module.exports = row;
