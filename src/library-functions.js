'use strict';

const coreFunctions = require('./core-functions');
const resultFunctions = require('./result-functions');

// Declares every C ABI function this bridge calls, against an already-loaded
// koffi library handle.
function libraryFunctions(lib) {
  return Object.assign({}, coreFunctions(lib), resultFunctions(lib));
}

module.exports = libraryFunctions;
