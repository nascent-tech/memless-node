'use strict';

// rowCount, readCell and releaseResult, against an already-loaded koffi
// library handle.
function cellFunctions(lib) {
  const rowCount = lib.func('uint64_t memless_result_row_count(uint64_t result)');
  const readCell = lib.func(
    'int32_t memless_result_cell(uint64_t result, uint64_t row, uint64_t column, '
    + '_Out_ int64_t *out_integer, _Out_ double *out_decimal, '
    + '_Out_ int32_t *out_boolean, _Out_ void **out_text)');
  const releaseResult = lib.func('void memless_result_release(uint64_t result)');
  const functions = { rowCount, readCell, releaseResult };
  return functions;
}

module.exports = cellFunctions;
