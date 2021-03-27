<div align="center">
  <img src="./logo-small.jpg" alt="Logo" title="TS Get Set">
  <h1>TS Get Set</h1>
  <p>100% Type safe get and set functions.</p>
</div>

---

[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Ayub-Begimkulov/ts-get-set/Test?label=CI&logo=github&style=flat-square)](https://github.com/Ayub-Begimkulov/ts-get-set/actions/workflows/main.yml)
[![Codecov](https://img.shields.io/codecov/c/github/Ayub-Begimkulov/ts-get-set?style=flat-square)](https://app.codecov.io/gh/Ayub-Begimkulov/ts-get-set)
[![npm](https://img.shields.io/npm/v/ts-get-set?style=flat-square)](https://www.npmjs.com/package/ts-get-set)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/ts-get-set?style=flat-square)](https://bundlephobia.com/result?p=ts-get-set)
[![GitHub](https://img.shields.io/github/license/Ayub-Begimkulov/ts-get-set?style=flat-square)](https://github.com/Ayub-Begimkulov/tiny-use-debounce/blob/master/LICENSE)

## Installation

```shell
# npm
npm i ts-get-set

# yarn
yarn add ts-get-set
```

## Usage

```ts
import { get, set } from "ts-get-set";

const a = {
  b: 5,
  c: [1, 2, { d: "asdf" }],
};

let d: string = get(a, "c.2.d");
console.log(d); // "asdf"

set(a, "c.2.d", "fdsa");

d = get(a, "c.2.d");
console.log(d); // "fdsa"
console.log(a.c[2].d); // "fdsa"
```

## API

### `get`

Gets the value at `path` of `object`. If the resolved value is `undefined`, the `defaultValue` is returned in its place.

Usage:

```ts
const obj = { a: [1, 2, { b: 3 }] };
get(obj, "a.2.b"); // 3
```

Type:

```ts
function get<Obj extends AnyObject, Key extends string, Default = undefined>(
  object: Obj,
  stringPath: Key,
  defaultValue?: Default
): Get<Obj, PathString<Key>, Default>;
```

### `set`

Usage:

```ts
const obj = {};
set(obj, "a.2.b", "hello"); // { a: [undefined, undefined, { b: "hello" }] }
```

Type:

```ts
function set<Obj extends AnyObject, Key extends string, Value>(
  object: Obj,
  stringPath: Key,
  value: Value
): Set<Obj, PathString<Key>, Value>;
```

## License

[MIT](./LICENSE)
