'use strict';

const { native } = require('./library');
const take = require('./message');
const ensureOk = require('./ensure-ok');
const { MemlessFault } = require('./fault');
const { INVALID_ARGUMENT } = require('./status');

function execute(handle, sql) {
  if (sql.includes('\0')) {
    throw new MemlessFault(INVALID_ARGUMENT, 'sql contains a NUL byte');
  }
  const outAffected = [0n];
  const outMessage = [null];
  const status = native.runExecute(handle, sql, outAffected, outMessage);
  ensureOk(status, take(outMessage));
  return Number(outAffected[0]);
}

module.exports = execute;
