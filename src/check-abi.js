'use strict';

const ABI_VERSION = require('./abi-version');

// Throws when the loaded cdylib doesn't speak the ABI version this bridge
// was written against.
function checkAbi(reported) {
  if (reported !== ABI_VERSION) {
    throw new Error(`memless ABI mismatch: expected ${ABI_VERSION}, got ${reported}`);
  }
}

module.exports = checkAbi;
