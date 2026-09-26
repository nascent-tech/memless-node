'use strict';

// An integer cell stays exact (brief S8.8): within the safe range it becomes
// a plain JS number for ergonomics, otherwise a BigInt. koffi hands back a
// bigint for most out-of-range int64s, but a plain (already lossy-looking)
// number for 2^53 itself — still exactly representable, so normalising
// through BigInt first recovers it losslessly regardless of which shape
// koffi chose to return.
function integerCell(value) {
  const exact = typeof value === 'bigint' ? value : BigInt(value);
  const asNumber = Number(exact);
  if (Number.isSafeInteger(asNumber)) {
    return asNumber;
  }
  return exact;
}

module.exports = integerCell;
