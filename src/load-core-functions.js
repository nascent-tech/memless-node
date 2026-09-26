'use strict';

// abiVersion, loadFile and releaseHandle, against an already-loaded koffi
// library handle.
function loadCoreFunctions(lib) {
  const abiVersion = lib.func('uint32_t memless_abi_version()');
  const loadFile = lib.func(
    'int32_t memless_load(const char *path, _Out_ uint64_t *out_handle, '
    + '_Out_ void **out_message)');
  const releaseHandle = lib.func('void memless_release(uint64_t handle)');
  const functions = { abiVersion, loadFile, releaseHandle };
  return functions;
}

module.exports = loadCoreFunctions;
