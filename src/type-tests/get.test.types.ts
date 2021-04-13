import { Get } from "../get";
import { assert, Equals } from ".";

// simple
assert<Equals<Get<{ a: 5 }, ["a"]>, 5>>(true);

// arrays
assert<Equals<Get<[1, 2, 3], ["2"]>, 3>>(true);

// mixed
assert<
  Equals<Get<{ a: [1, { b: ["a", "b"] }, 3] }, ["a", "1", "b", "1"]>, "b">
>(true);

// wrong path
assert<Equals<Get<{ a: 5 }, ["b"]>, undefined>>(true);

// default value
assert<Equals<Get<{ a: 5 }, ["b"], "asdf">, "asdf">>(true);

// default value with undefined
assert<Equals<Get<{ a: 5; b: undefined }, ["b"], "asdf">, "asdf">>(true);

// should work with unions correctly
assert<
  Equals<Get<{ a: { "2": "hello" } | [1, 2, 3] }, ["a", "2"]>, 3 | "hello">
>(true);

// should add undefined if one of union types is primitive
assert<Equals<Get<{ a: number | [1, 2, 3] }, ["a", "2"]>, 3 | undefined>>(true);

// union type should add undefined for arrays (noUncheckIndexAccess)
assert<Equals<Get<{ a: number[] }, ["a", "2"]>, number | undefined>>(true);

// regular arrays, primitive union
assert<
  Equals<
    Get<{ a: (number | { b: number })[] }, ["a", "2"]>,
    number | { b: number } | undefined
  >
>(true);
