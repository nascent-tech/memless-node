'use strict';

const { native } = require('./library');
const take = require('./message');
const ensureOk = require('./ensure-ok');
const readResult = require('./result');
const { MemlessFault } = require('./fault');
const { INVALID_ARGUMENT } = require('./status');

function query(handle, sql) {
  if (sql.includes('\0')) {
    throw new MemlessFault(INVALID_ARGUMENT, 'sql contains a NUL byte');
  }
  const outResult = [0n];
  const outMessage = [null];
  const status = native.runQuery(handle, sql, outResult, outMessage);
  ensureOk(status, take(outMessage));
  return readResult(outResult[0]);
}

module.exports = query;
