'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Same order as the PHP and Go bridges: release before debug, .dylib before
// .so.
const names = [
  'target/release/libmemless_capi.dylib',
  'target/debug/libmemless_capi.dylib',
  'target/release/libmemless_capi.so',
  'target/debug/libmemless_capi.so',
];

function workspaceCandidate(root) {
  return names.map((name) => path.join(root, name)).find((file) => fs.existsSync(file));
}

module.exports = workspaceCandidate;
