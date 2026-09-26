'use strict';

function libcFromLdd(text) {
  if (!text) {
    return null;
  }
  if (text.includes('musl')) {
    return 'musl';
  }
  return text.includes('GNU C Library') ? 'glibc' : null;
}

module.exports = libcFromLdd;
