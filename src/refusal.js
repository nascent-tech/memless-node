'use strict';

// MemlessRefusal carries the domain message verbatim (D13): the bridge
// translates the error shape, never the text. instanceof tells it apart from a
// MemlessFault (a boundary or internal fault).
class MemlessRefusal extends Error {
  constructor(message) {
    super(message);
    this.name = 'MemlessRefusal';
  }
}

module.exports = { MemlessRefusal };
