import { set, Set } from "./set";

declare function assert<T>(value: T): void;

type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type TestObject2 = {
  a: number;
  b: { c: number };
};

type TestPath2 = ["b", "c", "1"];

type Test2 = Set<TestObject2, TestPath2, "asdf">;

type Test3 = Set<[{ a: [1, { b: "asdf" }] }], ["0", "a", "1", "b"], "fdsa">;

// TODO check this 2 cases
let a = set([1, 2, "a"], "a.b", 5);
let b = set([1, 2, "a"] as const, "a.b", 5);

// simple
assert<Equals<Set<{ a: number }, ["a"], string>, { a: string }>>(true);

// nested
assert<
  Equals<Set<{ a: { b: number } }, ["a", "b"], string>, { a: { b: string } }>
>(true);

// TODO do we need to preserve readonly when using set?
// readonly object
// assert<
//   Equals<
//     Set<Readonly<{ a: 5; b: 6 }>, ["a"], "asdf">,
//     Readonly<{ a: "asdf"; b: 6 }>
//   >
// >(true);

// simple arrays
assert<Equals<Set<[1, 2, 3], ["1"], 4>, [1, 4, 3]>>(true);

// TODO do we need to preserve readonly when using set?
// simple readonly arrays
// assert<Equals<Set<readonly [1, 2, 3], ["1"], 4>, readonly [1, 4, 3]>>(true);

// mixed (objects and arrays)

// array but key is not array'ish
// TODO also check for nested
assert<Equals<Set<[1, 2, 3], ["a", "b"], 5>, [1, 2, 3] & { a: { b: 5 } }>>(
  true
);

// array but key is not array'ish with readonly
// TODO also check for nested
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
