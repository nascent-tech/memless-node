'use strict';

const { native } = require('./library');
const take = require('./message');
const ensureOk = require('./ensure-ok');
const { MemlessFault } = require('./fault');
const { INVALID_ARGUMENT } = require('./status');

function open(path) {
  if (path.includes('\0')) {
    throw new MemlessFault(INVALID_ARGUMENT, 'path contains a NUL byte');
  }
  const outHandle = [0n];
  const outMessage = [null];
  const status = native.loadFile(path, outHandle, outMessage);
  ensureOk(status, take(outMessage));
  return outHandle[0];
}

module.exports = open;
