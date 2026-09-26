'use strict';

const { native } = require('./library');
const take = require('./message');
const ensureOk = require('./ensure-ok');

function reload(handle) {
  const outMessage = [null];
  const status = native.runReload(handle, outMessage);
  ensureOk(status, take(outMessage));
}

module.exports = reload;
