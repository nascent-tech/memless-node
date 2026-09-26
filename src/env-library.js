'use strict';

const fs = require('node:fs');

function envLibrary(env) {
  if (!fs.existsSync(env)) {
    throw new Error(`memless cdylib not found at ${env}; set MEMLESS_LIB`);
  }
  return env;
}

module.exports = envLibrary;
