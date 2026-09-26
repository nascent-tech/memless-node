'use strict';

const koffi = require('koffi');
const { libraryPath } = require('./library-path');
const libraryFunctions = require('./library-functions');
const checkAbi = require('./check-abi');

// Loads the cdylib and declares its functions. Called once, lazily, on the
// first real call — never at require() time, so importing the bridge never
// touches the filesystem or loads native code on its own.
function openLibrary() {
  const lib = koffi.load(libraryPath());
  const functions = libraryFunctions(lib);
  checkAbi(functions.abiVersion());
  return functions;
}

module.exports = openLibrary;
