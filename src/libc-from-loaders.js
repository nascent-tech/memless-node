'use strict';

const muslLoaders = ['/lib/ld-musl-x86_64.so.1', '/lib/ld-musl-aarch64.so.1'];
const glibcLoaders = ['/lib64/ld-linux-x86-64.so.2', '/lib/ld-linux-aarch64.so.1'];

// The dynamic loader tells the libc when ldd is missing, as in distroless
// images; the musl loader wins, since gcompat installs a glibc one on Alpine.
function libcFromLoaders(exists) {
  if (muslLoaders.some(exists)) {
    return 'musl';
  }
  return glibcLoaders.some(exists) ? 'glibc' : null;
}

module.exports = libcFromLoaders;
