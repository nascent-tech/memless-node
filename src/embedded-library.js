'use strict';

const fs = require('node:fs');
const path = require('node:path');

// The library this package ships under lib/<platform>/ for the current
// platform; null when none is bundled for it, or when lib/ is empty, as in
// a checked-out workspace.
function embeddedLibrary(platform, lib) {
  if (!platform) {
    return null;
  }
  const file = path.join(lib, platform.name, platform.file);
  return fs.existsSync(file) ? file : null;
}

module.exports = embeddedLibrary;
