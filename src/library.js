'use strict';

const ABI_VERSION = require('./abi-version');
const ensureNative = require('./ensure-native');

// A lazy stand-in for the native function table: the cdylib is loaded and its
// ABI checked on the first real property access, never at require() time.
const native = new Proxy({}, {
  get(_target, property) {
    return ensureNative()[property];
  },
});

module.exports = { native, ABI_VERSION };
