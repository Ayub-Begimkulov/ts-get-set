import { assert, Equals } from ".";
import { set, Set } from "../set";

type TestObject = {
  a: number;
  b: { c: number };
};

type TestPath = ["b", "c", "1"];

assert<
  Equals<
    Set<TestObject, TestPath, "asdf">,
    {
      a: number;
      b: {
        c: [undefined, "asdf"];
      };
    }
  >
>(true);

type Test3 = Set<[{ a: [1, { b: "asdf" }] }], ["0", "a", "1", "b"], "fdsa">;

// simple
assert<Equals<Set<{ a: number }, ["a"], string>, { a: string }>>(true);

// nested
assert<
  Equals<Set<{ a: { b: number } }, ["a", "b"], string>, { a: { b: string } }>
>(true);

// simple arrays
assert<Equals<Set<[1, 2, 3], ["1"], 4>, [1, 4, 3]>>(true);

// mixed (objects and arrays)
assert<
  Equals<
    Set<{ a: { b: [1, 2, 3] } }, ["a", "b", "1"], 4>,
    { a: { b: [1, 4, 3] } }
  >
>(true);

// array but key is not array'ish
assert<Equals<Set<[1, 2, 3], ["a", "b"], 5>, [1, 2, 3] & { a: { b: 5 } }>>(
  true
);

// array but key is not array'ish with readonly
assert<
  Equals<
    Set<readonly [1, 2, 3], ["a", "b"], 5>,
    readonly [1, 2, 3] & { a: { b: 5 } }
  >
>(true);

// not tuple arrays - change type
assert<
  Equals<Set<{ a: number[] }, ["a", "2"], "asdf">, { a: (number | "asdf")[] }>
>(true);

// should handle objects within uncreated arrays
// correctly
let a: {
  a: [
    undefined,
    {
      c: string;
    }
  ];
} = set({}, "a.1.c", "asdf");

// TODO do we need to preserve readonly when using set?
// readonly object
// assert<
//   Equals<
//     Set<Readonly<{ a: 5; b: 6 }>, ["a"], "asdf">,
//     Readonly<{ a: "asdf"; b: 6 }>
//   >
// >(true);

// TODO do we need to preserve readonly when using set?
// simple readonly arrays
// assert<Equals<Set<readonly [1, 2, 3], ["1"], 4>, readonly [1, 4, 3]>>(true);
