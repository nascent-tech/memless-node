'use strict';

const loadCore = require('./load-core-functions');
const executeCore = require('./execute-core-functions');

// The load/query/execute/release functions, against an already-loaded koffi
// library handle.
function coreFunctions(lib) {
  const functions = Object.assign({}, loadCore(lib), executeCore(lib));
  return functions;
}

module.exports = coreFunctions;
