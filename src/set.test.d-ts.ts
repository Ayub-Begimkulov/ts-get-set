import { Set } from "./set";

declare function assert<T>(value: T): void;

type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

// TODO add tests without "readonly" data
type TestObject = { a: 5; b: [1, 2, 3] };

assert<
  Equals<
    Set<TestObject, ["b", "2"], { c: "d" }>,
    {
      a: 5;
      b: [
        1,
        2,
        {
          c: "d";
        }
      ];
    }
  >
>(true);

assert<
  Equals<
    Set<{ a: [1, 2, 3] }, ["a", "2"], "asdf">,
    {
      a: [1, 2, "asdf"];
    }
  >
>(true);

assert<
  Equals<
    Set<TestObject, ["b", "2"], { c: "d" }>,
    { a: 5; b: [1, 2, { c: "d" }] }
  >
>(true);

// ======================================
type TestObject2 = {
  a: number;
  b: { c: number };
};

type TestPath2 = ["b", "c", "1"];

type Test2 = Set<TestObject2, TestPath2, "asdf">;

type Test3 = Set<[{ a: [1, { b: "asdf" }] }], ["0", "a", "1", "b"], "fdsa">;
