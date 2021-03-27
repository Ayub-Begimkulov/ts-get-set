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
