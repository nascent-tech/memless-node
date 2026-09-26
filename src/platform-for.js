'use strict';

const platforms = {
  'darwin-arm64': { name: 'darwin-arm64', file: 'libmemless_capi.dylib' },
  'darwin-x64': { name: 'darwin-x64', file: 'libmemless_capi.dylib' },
  'linux-x64-glibc': { name: 'linux-x64-gnu', file: 'libmemless_capi.so' },
  'linux-arm64-glibc': { name: 'linux-arm64-gnu', file: 'libmemless_capi.so' },
};

// The bundled platform matching an os, a cpu and, on Linux, a libc; null
// when none is bundled, such as on Windows or musl.
function platformFor(os, arch, libc) {
  const key = os === 'linux' ? `${os}-${arch}-${libc}` : `${os}-${arch}`;
  return platforms[key] || null;
}

module.exports = platformFor;
