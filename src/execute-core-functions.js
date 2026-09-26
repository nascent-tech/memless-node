'use strict';

// runQuery, runExecute, runReload and freeString, against an already-loaded
// koffi library handle.
function executeCoreFunctions(lib) {
  const runQuery = lib.func(
    'int32_t memless_query(uint64_t handle, const char *sql, '
    + '_Out_ uint64_t *out_result, _Out_ void **out_message)');
  const runExecute = lib.func(
    'int32_t memless_execute(uint64_t handle, const char *sql, '
    + '_Out_ uint64_t *out_affected, _Out_ void **out_message)');
  const runReload = lib.func(
    'int32_t memless_reload(uint64_t handle, _Out_ void **out_message)');
  const freeString = lib.func('void memless_free_string(void *message)');
  const functions = { runQuery, runExecute, runReload, freeString };
  return functions;
}

module.exports = executeCoreFunctions;
