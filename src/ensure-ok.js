'use strict';

const { MemlessRefusal } = require('./refusal');
const { MemlessFault } = require('./fault');
const { STATUS_OK, STATUS_REFUSED } = require('./status');

function ensureOk(status, message) {
  if (status === STATUS_OK) {
    return;
  }
  if (status === STATUS_REFUSED) {
    throw new MemlessRefusal(message);
  }
  throw new MemlessFault(status, message);
}

module.exports = ensureOk;
