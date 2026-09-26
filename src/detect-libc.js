'use strict';

const libcFromLdd = require('./libc-from-ldd');
const libcFromReport = require('./libc-from-report');
const libcFromLoaders = require('./libc-from-loaders');

// 'glibc', 'musl' or null: /usr/bin/ldd first, then the diagnostic report,
// then the dynamic loader under /lib. The bundled Linux libraries need glibc,
// so musl, or a libc none of them can tell, must not load them.
function detectLibc(probe) {
  return libcFromLdd(probe.ldd()) || libcFromReport(probe.report()) || libcFromLoaders(probe.exists);
}

module.exports = detectLibc;
