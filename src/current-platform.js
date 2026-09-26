'use strict';

const platformFor = require('./platform-for');
const detectLibc = require('./detect-libc');
const systemProbe = require('./system-probe');

let cached;

// The platform of this process, computed once; the libc is only probed on
// Linux, and an unknown libc leaves no bundled library to look for.
function currentPlatform() {
  if (cached === undefined) {
    const libc = process.platform === 'linux' ? detectLibc(systemProbe) : null;
    cached = platformFor(process.platform, process.arch, libc);
  }
  return cached;
}

module.exports = currentPlatform;
