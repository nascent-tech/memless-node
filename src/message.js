'use strict';

const koffi = require('koffi');
const { native } = require('./library');

function take(slot) {
  const ptr = slot[0];
  if (!ptr) {
    return '';
  }
  const text = koffi.decode(ptr, 'char', -1);
  native.freeString(ptr);
  return text;
}

module.exports = take;
