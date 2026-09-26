// Type declarations for the public surface of ./index.js. Kept hand-written
// and in lockstep with the JS: this bridge has no separate build step, so the
// .d.ts is the only place the shape is checked ahead of time.

/**
 * A single cell as memless renders it: text, decimal, boolean, or absent.
 * An integer is a `number` within the safe range, a `bigint` beyond it — it
 * always stays exact (brief S8.8).
 */
export type Cell = string | number | bigint | boolean | null;

/** The shape returned by Instance#query. */
export interface QueryResult {
  columns: string[];
  rows: Cell[][];
}

/**
 * A loaded memless file. Every method throws MemlessRefusal (a domain refusal,
 * message verbatim) or MemlessFault (a boundary/internal fault, with a status)
 * on failure.
 */
export class Instance {
  private constructor(handle: number | bigint);

  /** The opaque handle behind this instance (koffi returns a plain number
   *  when it fits safely, a bigint otherwise — same rule as an integer cell). */
  readonly handle: number | bigint;
  /** Set once release() has run; a further release() is then a no-op. */
  readonly released: boolean;

  query(sql: string): QueryResult;
  execute(sql: string): number;
  begin(): void;
  commit(): void;
  rollback(): void;
  reload(): void;
  release(): void;
}

/** Loads a memless file through the C ABI and returns an Instance. */
export function load(path: string): Instance;

/** A domain refusal (D13): the message is the core's, verbatim. */
export class MemlessRefusal extends Error {
  constructor(message: string);
}

/** A boundary or internal fault, carrying the ABI status (see memless.h). */
export class MemlessFault extends Error {
  constructor(status: number, message: string);
  readonly status: number;
}
