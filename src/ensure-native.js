'use strict';

const openLibrary = require('./open-library');

let cached = null;

// Loads the cdylib and declares its functions on first call, then returns the
// same table on every later call.
function ensureNative() {
  if (!cached) cached = openLibrary();
  return cached;
}

module.exports = ensureNative;
