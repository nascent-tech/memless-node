'use strict';

// columnCount and columnName, against an already-loaded koffi library handle.
function columnFunctions(lib) {
  const columnCount = lib.func('uint64_t memless_result_column_count(uint64_t result)');
  const columnName = lib.func('const char *memless_result_column(uint64_t result, uint64_t index)');
  const functions = { columnCount, columnName };
  return functions;
}

module.exports = columnFunctions;
