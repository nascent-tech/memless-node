# memless — Node.js bridge

A Node.js bridge to the memless C ABI through [koffi](https://koffi.dev), without
a native addon. It loads the same `libmemless_capi` cdylib as the Go and PHP
bridges and speaks the same contract (ABI version 5), so the three stay in
parity from a single shared surface. Node.js 18 or later. See the
[project README](https://github.com/nascent-tech/memless#readme) for what
memless is, the guessing rules and the supported SQL subset.

## Install

```sh
npm install @nascent-tech/memless
```

That is all: the package carries the native library for four platforms under
`lib/<platform>/`, like the Go module and the Composer package, and the bridge
loads the one that matches your machine:

| Directory | Platform |
| --- | --- |
| `lib/darwin-arm64/` | macOS on Apple silicon |
| `lib/darwin-x64/` | macOS on Intel |
| `lib/linux-x64-gnu/` | Linux x86_64 with glibc |
| `lib/linux-arm64-gnu/` | Linux aarch64 with glibc |

The Linux libraries need glibc 2.39 or later (Ubuntu 24.04 or later). Elsewhere
(Linux with musl or an older glibc, for instance), see [The cdylib](#the-cdylib).

Each version is also shown, exactly as npm installs it, in the mirror
repository `nascent-tech/memless-node`, which the release workflow fills at
each version, like the PHP and Go mirrors.

Up to 0.3.0, each library came in its own optional package,
`@nascent-tech/memless-<platform>`; those packages are no longer published.

## Surface

```js
const { load, MemlessRefusal, MemlessFault } = require('@nascent-tech/memless');

const db = load('data.yaml');                 // throws MemlessRefusal / MemlessFault
const result = db.query('SELECT name FROM users');
// -> { columns: ['name'], rows: [['Ada'], ['Grace']] }
const affected = db.execute("UPDATE users SET name = 'Zoe' WHERE id = '01H7B2'");

db.begin();                                   // BEGIN / COMMIT / ROLLBACK
db.execute("DELETE FROM wallets WHERE id = 'w_123'");
db.commit();

db.reload();                                  // re-reads the file, refused if
                                               // a transaction is open

db.release();
```

- A cell is a `number`, `bigint`, `string`, `boolean`, or `null`. An integer
  stays exact: within `[Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]` it
  comes back as a plain JS `number`; beyond that range it comes back as a
  `bigint` instead of silently losing precision.
- `MemlessRefusal` carries the domain message verbatim (D13). `MemlessFault`
  is a boundary or internal fault: its message reads
  `memless fault (<status>): <message>`, the same text as in the Go and PHP
  bridges, and its `status` property carries the ABI status (`2` for an
  invalid argument, such as a released instance or a NUL byte in the SQL, `3`
  for an internal fault).
- `reload()` re-reads the file into a fresh in-memory state, exactly as
  `load()` would build it; it throws a `MemlessRefusal` while a transaction is
  open or when the file would be refused at load, and the old state stays
  usable either way.
- A library that cannot be found or speaks another ABI version throws a plain
  `Error` on the first call that needs it.
- TypeScript declarations ship in `src/index.d.ts`.
- Inside an open transaction, `query` sees the not-yet-committed writes
  (read-your-writes); `commit` rewrites the file once.

## The cdylib

The bridge loads the native library on the first call that needs it, never
at `require()` time, and looks for it in the same order as the Go and PHP
bridges:

1. `MEMLESS_LIB`, a trusted (ideally absolute) path that must name an
   existing file;
2. the library this package bundles for the current platform, under
   `lib/<platform>/`. On Linux the bridge checks the libc, once
   (`/usr/bin/ldd`, then `process.report`, then the dynamic loader under
   `/lib`), because the bundled libraries
   need glibc: musl, or a libc it cannot tell, has no bundled library;
3. inside a checked-out workspace, `target/release/`, then `target/debug/`
   (`.dylib` before `.so`).

When nothing is found, the error says to set `MEMLESS_LIB`. The library must
speak ABI version 5. On another platform, or with your own build, set
`MEMLESS_LIB`:

```sh
cargo build --release -p memless-capi
export MEMLESS_LIB="$PWD/target/release/libmemless_capi.so"   # .dylib on macOS
```

`MEMLESS_LIB` loads arbitrary native code, like any FFI library path — only
point it at a library you trust.

In this repository, `lib/` is empty: the release workflow fills it with the
four libraries when it packs the bridge, so that working on the bridge always
loads the library you build under `target/`.

## Running the tests

```sh
npm ci
npm test           # node --test
npm run typecheck  # tsc --noEmit --strict against tests/types-check.ts
```

The parity driver (`harness/parity/node`) depends on this package by path and
reuses its `node_modules`, so run `npm ci` here before
`npm ci --prefix harness/parity/node`.

## Contributing

This bridge is developed in [`bindings/node`](https://github.com/nascent-tech/memless/tree/main/bindings/node)
of [nascent-tech/memless](https://github.com/nascent-tech/memless), next to
the Rust core, the two other bridges and the parity harness that keeps the
three in agreement. The repository `nascent-tech/memless-node` is a mirror
that the release workflow rewrites at each version: open issues and pull
requests on [nascent-tech/memless](https://github.com/nascent-tech/memless/issues/new/choose),
and read its [contributing guide](https://github.com/nascent-tech/memless/blob/main/CONTRIBUTING.md)
first. Security issues go to its
[security policy](https://github.com/nascent-tech/memless/security/policy).
