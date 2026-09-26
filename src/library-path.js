'use strict';

const path = require('node:path');
const resolveLibrary = require('./resolve-library');
const embeddedLibrary = require('./embedded-library');
const currentPlatform = require('./current-platform');

// The workspace root, three levels above bindings/node/src.
const root = path.resolve(__dirname, '..', '..', '..');

// The libraries this package bundles, one directory per platform.
const lib = path.resolve(__dirname, '..', 'lib');

// libraryPath resolves the cdylib from MEMLESS_LIB, a trusted (ideally
// absolute) path, then from lib/ of this package for the current platform,
// then, inside a checked-out workspace, under target/. MEMLESS_LIB loads
// arbitrary native code, like any FFI library path.
function libraryPath() {
  const embedded = () => embeddedLibrary(currentPlatform(), lib);
  return resolveLibrary({ env: process.env.MEMLESS_LIB, embedded, root });
}

module.exports = { libraryPath };
