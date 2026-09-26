# Memless for Node.js

Query and change a YAML file with SQL, from Node.js. Memless loads the file
into memory, runs your SQL against it and writes every accepted change back to
the file — no schema, no server. It is made for test fixtures and demos.

Everything you need to use it from Node.js is on this page. The
[project README](https://github.com/nascent-tech/memless#readme) has more
detail on the file format, transactions and errors.

## Install

```sh
npm install @nascent-tech/memless
```

Requires Node.js 18 or later. The package ships the native engine for macOS
(Apple silicon, Intel) and Linux with glibc 2.39 or later (x86_64, aarch64), so
there is nothing else to install. It calls the engine through
[koffi](https://koffi.dev): no compiler, no native addon build. TypeScript
declarations are included.

## Quick start

```yaml
# data.yaml
users:
  - id: 1
    name: Ada
  - id: 2
    name: Grace
```

```js
const { load } = require('@nascent-tech/memless');

const db = load('data.yaml');
try {
  db.execute("INSERT INTO users (id, name) VALUES (3, 'Linus')"); // data.yaml is rewritten

  const { columns, rows } = db.query('SELECT name FROM users ORDER BY name');
  console.log(columns, rows); // [ 'name' ] [ [ 'Ada' ], [ 'Grace' ], [ 'Linus' ] ]
} finally {
  db.release();
}
```

With ES modules: `import { load } from '@nascent-tech/memless';`.

## Writing the YAML file

Each top-level key is a table, each table is a list of rows, and each row is a
map of column names to values. Memless reads everything else from the data:

| Rule | What Memless expects |
| --- | --- |
| Row identity | Every row has an `id`, text or integer, unique within its table. `5` and `"5"` are different ids. |
| Relations | A column named `<name>_id` points at the `id` of the table `<name>s`, when it exists: `user_id` → `users`. The plural is always `<name>` + `s` (`category_id` → `categorys`). Every value present must name an existing row; a missing value is allowed. |
| Values | Text, integer, decimal or boolean. Lists and maps inside a row are refused. |
| Missing values | Any column but `id` may be left out; `null` (or `~`) counts as missing and reads back as `null`. |
| Types never convert | An integer (`2`) and a decimal (`2.0`) are different types. A comparison only matches the same type: `WHERE amount > 1` skips `1.5`, and `WHERE amount = 2.0` does not match `2`. Keep one type per column (`2.0`, not `2`, in a decimal column). |
| Mixed types | Allowed in a column, but sorting or summing rows of different types is refused. |

## Supported SQL

| Statement | Supported form |
| --- | --- |
| `SELECT` | `SELECT <columns> \| * FROM <table>`, with optional `WHERE`, `ORDER BY` and one `JOIN` |
| `WHERE` | `=`, `<>`, `<`, `<=`, `>`, `>=`, `IS NULL`, `IS NOT NULL`, with `AND`, `OR` and parentheses |
| `JOIN` | One `INNER JOIN <table> ON <a>.<name>_id = <b>.id`; every column is then written `table.column` |
| `ORDER BY` | One or more columns, `ASC` (default) or `DESC`; ties keep the file order, missing values come last |
| Aggregates | `SELECT COUNT(*)` or `SELECT SUM(<column>)`, alone in the select list |
| `INSERT` | `INSERT INTO <table> (<columns>) VALUES (<values>)`; the column list is required |
| `UPDATE` / `DELETE` | `UPDATE <table> SET <column> = <value>, … [WHERE …]`, `DELETE FROM <table> [WHERE …]` |

Anything else — `GROUP BY`, `LIMIT`, several joins, `ORDER BY 1`, `LIKE`, `IN`, subqueries,
`CREATE`… — is refused with `<construct> is outside the supported SQL subset`.

## Good to know

- **Writes are saved at once.** Outside a transaction, each accepted write
  rewrites the file before the call returns. The file is replaced atomically
  through a temporary `.<name>.memless-tmp` next to it: add `.*.memless-tmp`
  to your `.gitignore`.
- **In tests, load a copy of your fixture**, or wrap the test in a
  transaction that you roll back, so that every test starts from the same
  data.
- **One instance per file.** Memless does not coordinate writers: do not
  change the same file from two instances or two processes at once.

## API

| Call | Returns | What it does |
| --- | --- | --- |
| `load(path)` | `Instance` | Reads the YAML file into memory. |
| `db.query(sql)` | `{ columns, rows }` | Runs a `SELECT`. `columns` is an array of names, `rows` an array of arrays of values. |
| `db.execute(sql)` | `number` | Runs an `INSERT`, `UPDATE` or `DELETE` and returns the number of rows affected. Outside a transaction, the file is rewritten before it returns. |
| `db.begin()` / `db.commit()` / `db.rollback()` | — | Groups writes: nothing is written until `commit()`; `rollback()` discards them. |
| `db.reload()` | — | Rereads the file, after something else changed it. Refused while a transaction is open. |
| `db.release()` | — | Frees the instance. Calling it again does nothing; any other call afterwards throws. |

## Values

| In the file | In JavaScript |
| --- | --- |
| text | `string` |
| integer | `number`, or `bigint` beyond `Number.MAX_SAFE_INTEGER`, so that it stays exact |
| decimal | `number` |
| boolean | `boolean` |
| missing value | `null` |

## Errors

Every method throws one of two errors. Their messages are identical in the
PHP and Go versions of Memless.

- **`MemlessRefusal`** — the file or the SQL breaks a rule: unknown table or
  column, broken relation, unsupported SQL, transaction already open. It is an
  expected outcome, which you can assert on in a test.
- **`MemlessFault`** — the package was misused (for example, a call after
  `release()`) or an internal error happened. Its `status` property is `2` for
  an invalid argument and `3` for an internal error.

```js
const { load, MemlessRefusal } = require('@nascent-tech/memless');

try {
  db.query('SELECT nope FROM users');
} catch (error) {
  if (!(error instanceof MemlessRefusal)) throw error;
  console.log(error.message); // no column "nope" in table "users"
}
```

If the native library cannot be found or has an incompatible version, the
first call throws a plain `Error` that explains what to do.

## Troubleshooting

**`npm install` warns about install scripts.** npm 12 no longer runs the
install scripts of dependencies, and npm 11.16 and later warn about them. You
can leave `koffi`'s blocked: it ships prebuilt binaries, and Memless works
without it.

**Your platform is not covered** (Alpine and other musl-based Linux, glibc
older than 2.39). Build the engine and set `MEMLESS_LIB`:

```sh
git clone https://github.com/nascent-tech/memless.git && cd memless
cargo build --release -p memless-capi
export MEMLESS_LIB="$PWD/target/release/libmemless_capi.so"   # .dylib on macOS
```

The package looks for the engine in this order: `MEMLESS_LIB`, then the library
bundled for your platform under `lib/<platform>/`, then, inside a clone of the
repository, `target/release/` and `target/debug/`. On Linux it checks the libc
first (`/usr/bin/ldd`, the diagnostic report, then the dynamic loader under
`/lib`): musl, or a libc it cannot identify, gets no bundled library.
`MEMLESS_LIB` loads native code into your process; only point it at a library
you trust.

**Upgrading from 0.3.0 or earlier.** The engine used to come in separate
packages, `@nascent-tech/memless-<platform>`; they are deprecated and no
longer needed. Remove them from your `package.json` if you added them
yourself.

## Contributing

This package is developed in
[`bindings/node`](https://github.com/nascent-tech/memless/tree/main/bindings/node)
of [nascent-tech/memless](https://github.com/nascent-tech/memless), with the
engine and the PHP and Go versions. Open issues and pull requests there — the
repository `nascent-tech/memless-node` is a read-only copy published with each
release. See the
[contributing guide](https://github.com/nascent-tech/memless/blob/main/CONTRIBUTING.md)
and the [security policy](https://github.com/nascent-tech/memless/security/policy).

To work on this package in a clone of the repository:

```sh
cargo build --release -p memless-capi   # in a clone, the package loads target/release/
npm ci --prefix bindings/node
npm test --prefix bindings/node
npm run typecheck --prefix bindings/node
```
