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

[playground-link]: https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbzgcwKYwDRwM7rgXzgDMoIQ4ByGbAWjRhtxgoG4AoNgYwgDtt4AhnAC8iNnDgAjAFxwArBnFxOsgNoBGLACYsSACayARAOx6ihggF1F+dmwA2ePSJToAFAKyHOAOi0+9QwBKOxgATzBUOAARABUIqNFwyIgiOD12bj4IRx97CGQ3PRC4AHpSuGNTcw4s-jgAVzA9ARhUPQBBFyYPL191Qy8AC1R7fODQhLgAVWbW9o74yJdk1FTGubbOuy5ebBzUPIK3JpatjpCgA

## Installation

```shell
# npm
npm i ts-get-set

# yarn
yarn add ts-get-set
```

## Usage

[Try in Playground][playground-link]

```ts
import { get, set } from "ts-get-set";

const a = {
  b: 5,
  c: [1, 2, { d: "asdf" }],
};

let d = get(a, "c.2.d");

type DType = typeof d; // string | undefined
console.log(d); // "asdf"

const updatedA = set(a, "c.1", "hello");

type UpdatedAType = typeof updatedA;
// {
//   b: number,
//   c: (number | string | { d: string })[]
// }

console.log(updatedA);
// {
//   b: 5,
//   c: [1, 'hello', { d: "asdf" }],
// }
```

Note that `undefined` was added to the `DType` because array (`a.c`) is not tuple, so we can't know for sure that this index exists, and for that reason we add `undefined` to the return type. This behavior is similar to `noUncheckIndexAccess` option in `tsconfig`.

## Recommended configurations

<!-- TODO add description about config options -->

When using this library it's recommended to turn on these options in your `tsconfig.json`:

```js
{
  "compilerOptions": {
    /* ... */
    "strict": true,
    "noUncheckIndexAccess": true
  }
}
```

## Limitations

- TypeScript version must be 4.2 or higher
- `set` mutates object but there isn't a way to type it correctly right now, so you have to reassign it to another variable:

```ts
const obj = {
  b: 5,
  c: {
    d: "e",
  },
};

const reassignedObj = set(obj, "c.d", 6);

type ObjDType = typeof obj.c.d; // string

type ReassignedObjDType = typeof reassignedObj.c.d; // number

// reassignedObject has a different type so TS will complain
// about it, but it's the same object
// @ts-expect-error
console.log(reassignedObj === obj); // true
```

- `get` and `set` functions support maximum object depth of 16 (It's hardcoded number that prevents infinite type recursion. I don't think that there is any real world scenario where this won't be enough)

> Note that all these limitations (except first one) could potentially be fixed in near future by using some trick that I'm not aware of right now or by future TS improvement. If you have some ideas about them, feel free to open issue or PR.

## Migrating from version 1

The external API for `get` and `set` functions hasn't changed. Therefor, you shouldn't face any issues if you haven't used exported utility types (`Get`, `Set`, etc.).

But if you have used them, check the list of changes:

- `PathString` was renamed to `StringToPath`.
- `Get` and `Set` accept `path` as string instead of array:

```ts
// version 1
Get<obj, ['some', 'path']>
// or
Get<obj, PathString<'some.path'>>

// now
Get<obj, 'some.path'>
```

## API

### `get`

Gets the value at `path` of `object`. If the resolved value is `undefined`, the `defaultValue` is returned in its place.

Usage:

```ts
const object = { a: [1, 2, { b: 3 }] };
get(object, "a.2.b"); // 3
```

Type:

```ts
function get<Obj extends AnyObject, Path extends string, Default = undefined>(
  object: Obj,
  stringPath: Path,
  defaultValue?: Default
): Get<Obj, Path, Default>;
```

### `set`

Usage:

```ts
const obj = {};
set(obj, "a.2.b", "hello"); // { a: [undefined, undefined, { b: "hello" }] }
```

Type:

```ts
function set<Obj extends AnyObject, Path extends string, Value>(
  object: Obj,
  path: Path,
  value: Value
): Set<Obj, Path, Value>;
```

### `stringToPath`

Converts a dot notation string to a path array

Usage:

```ts
const path = stringToPath("a.b.2.c.5");

console.log(path); // ["a", "b", "2", "c", "5"]
```

### `StringToPath`

A type that converts string to a path.

Usage:

```ts
type Path = StringToPath<"a.b.c.1">; // ["a", "b", "c", "1"]
```

### `Get`

A type that gets a property from object at specified path.

Usage:

```ts
type NestedProps = Get<{ a: { b: [1, "c"] } }, "a.b.2">; // "c";
```

### `Set`

A type that sets the property to a provided value at path.

```ts
type Data = { b: number; c: string };

type NewData = Set<Data, "c.d", string[]>; // { c: { d: string[]; } b: number; }
```

## Roadmap

<!-- TODO add link open an issue -->

Here is the list of features that I want to add in the near future. It's not the strict set of tasks but more of a plan for the development of this package. If you have any suggestions, feel free to open an issue.

- [x] get, set and stringToPath 100% type safety (open an issue if you've found some bug).
- [ ] Support for `[]` syntax for index access.
- [ ] Suggestions in dot notation string (may increase compilation time).

## Further readings

- [TypeScript: type-safe get and set functions - part 1](https://www.ayubbegimkulov.com/ts-get-set/)

## License

[MIT](./LICENSE)
