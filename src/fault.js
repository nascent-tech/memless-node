'use strict';

// MemlessFault is a boundary or internal fault (InvalidArgument or Internal),
// not a file refusal. instanceof tells it apart from a MemlessRefusal; the
// status (see memless.h) is carried both in the message and as a read-only
// property.
class MemlessFault extends Error {
  constructor(status, message) {
    super(`memless fault (${status}): ${message}`);
    this.name = 'MemlessFault';
    Object.defineProperty(this, 'status', { value: Number(status), enumerable: true });
  }
}

module.exports = { MemlessFault };
