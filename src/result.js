'use strict';

const { native } = require('./library');
const columns = require('./columns');
const records = require('./records');

function readResult(result) {
  try {
    const header = columns(result);
    const rows = records(result, header.length);
    return { columns: header, rows };
  } finally {
    native.releaseResult(result);
  }
}

module.exports = readResult;
