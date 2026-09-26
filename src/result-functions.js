'use strict';

const columnFunctions = require('./column-functions');
const cellFunctions = require('./cell-functions');

// The result-reading functions, against an already-loaded koffi library handle.
function resultFunctions(lib) {
  const functions = Object.assign({}, columnFunctions(lib), cellFunctions(lib));
  return functions;
}

module.exports = resultFunctions;
