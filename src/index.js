'use strict';

const { Instance } = require('./instance');
const open = require('./loader');
const { MemlessRefusal } = require('./refusal');
const { MemlessFault } = require('./fault');

function load(path) {
  return new Instance(open(path));
}

module.exports = { load, Instance, MemlessRefusal, MemlessFault };
