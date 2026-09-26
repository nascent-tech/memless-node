'use strict';

const workspaceCandidate = require('./workspace-candidate');

const notFound = 'memless cdylib not found: none bundled with this package, none under target/; set MEMLESS_LIB';

function workspaceLibrary(root) {
  const found = workspaceCandidate(root);
  if (!found) {
    throw new Error(notFound);
  }
  return found;
}

module.exports = workspaceLibrary;
