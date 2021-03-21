<div align="center">
  <img src="./logo-small.jpg" alt="Logo" title="TS Get Set">
  <h1>TS Get Set</h1>
  <p>100% Type safe get and set functions.</p>
</div>

---

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

## License

[MIT](./LICENSE)
