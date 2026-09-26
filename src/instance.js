'use strict';

const runQuery = require('./query');
const runExecute = require('./execute');
const runReload = require('./reload');
const { native } = require('./library');

const BEGIN = 'BEGIN';
const COMMIT = 'COMMIT';
const ROLLBACK = 'ROLLBACK';

class Instance {
  constructor(handle) {
    Object.defineProperty(this, 'handle', { value: handle, enumerable: true });
    this.released = false;
  }

  query(sql) {
    return runQuery(this.handle, sql);
  }

  execute(sql) {
    return runExecute(this.handle, sql);
  }

  begin() {
    runExecute(this.handle, BEGIN);
  }

  commit() {
    runExecute(this.handle, COMMIT);
  }

  rollback() {
    runExecute(this.handle, ROLLBACK);
  }

  reload() {
    runReload(this.handle);
  }

  release() {
    if (this.released || !this.handle) {
      return;
    }
    this.released = true;
    native.releaseHandle(this.handle);
  }
}

module.exports = { Instance };
