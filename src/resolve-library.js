'use strict';

const envLibrary = require('./env-library');
const workspaceLibrary = require('./workspace-library');

// The search order shared by the three bridges: MEMLESS_LIB, then the library
// bundled for this platform, then target/release and target/debug.
function resolveLibrary(plan) {
  if (plan.env) {
    return envLibrary(plan.env);
  }
  return plan.embedded() || workspaceLibrary(plan.root);
}

module.exports = resolveLibrary;
