<div align="center">
  <img src="./logo.svg" alt="Logo" title="TS Get Set" width="360px">
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

const updatedA = set(a, "c.2.d", "fdsa");

console.log(updatedA);
// {
//   b: 5,
//   c: [1, 2, { d: "fdsa" }],
// };

d = get(a, "c.2.d");
console.log(d); // "fdsa"
console.log(a.c[2].d); // "fdsa"
```

<!-- ## Limitations

There are few limitations with this library that, unfortunately,couldn't be solved right now:

1. Although `set` function mutates passed object, it's impossible to correctly type this (if you have any suggestions, feel free share). So for now you'd need to reassign your object to a new variable after calling `set`.
2. -->

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

### `stringToPath`

Converts a dot notation string to a path array

Usage:

```ts
const path = stringToPath("a.b.2.c.5");

console.log(path); // ["a", "b", "2", "c", "5"]
```

### `PathString`

A type that converts string to a path.

Usage:

```ts
type Path = PathString<"a.b.c.1">; // ["a", "b", "c", "1"]
```

### `Get`

A type that gets a property from object at specified path.

Usage:

```ts
type NestedProps = Get<{ a: { b: [1, "c"] } }, ["a", "b", "2"]>; // "c";
// or
type NestedProps = Get<{ a: { b: [1, "c"] } }, PathString<"a.b.2">>; // "c";
```

### `Set`

A type that sets the property to a provided value at path.

```ts
type Data = { b: number; c: string };
type NewData = Set<Data, ["c", "d"], string[]>; // { c: { d: string[]; } b: number; }
// or
type NewData = Set<Data, PathString<"c.d">, string[]>; // { c: { d: string[]; } b: number; }
```

## Roadmap

<!-- TODO add link open an issue -->

Here is the list of features that I want to add in the near future. It's not the strict set of tasks but more of a plan for the development of this package. If you have any suggestions, feel free to open an issue.

- [x] get, set and stringToPath 100% type safety (open an issue if you've found some bug).
- [ ] Support for `[]` syntax for index access.
- [ ] Suggestions in dot notation string (may increase compilation time).

## License

[MIT](./LICENSE)
