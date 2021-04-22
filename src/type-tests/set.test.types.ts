import { assert, Equals } from ".";
import { set, Set } from "../set";

// simple
assert<Equals<Set<{ a: number }, "a", string>, { a: string }>>(true);

// nested
assert<Equals<Set<{ a: { b: number } }, "a.b", string>, { a: { b: string } }>>(
  true
);

// simple arrays
assert<Equals<Set<[1, 2, 3], "1", 4>, [1, 4, 3]>>(true);

// mixed (objects and arrays)
assert<
  Equals<Set<{ a: { b: [1, 2, 3] } }, "a.b.1", 4>, { a: { b: [1, 4, 3] } }>
>(true);

// should change value if not object
type TestObject = {
  a: number;
  b: { c: number };
};

type TestPath = "b.c.1";

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

// should return the same object if empty path
assert<Equals<Set<{ a: number }, "", string>, { a: number }>>(true);

// should create objects if they are not present
assert<Equals<Set<{}, "a.b", 1>, { a: { b: 1 } }>>(true);

// should create arrays if they are not present
assert<Equals<Set<[], "1.2", 1>, [undefined, [undefined, undefined, 1]]>>(true);

// array but key is not array'ish
assert<Equals<Set<[1, 2, 3], "a.b", 5>, [1, 2, 3] & { a: { b: 5 } }>>(true);

// array but key is not array'ish with readonly
assert<
  Equals<
    Set<readonly [1, 2, 3], "a.b", 5>,
    readonly [1, 2, 3] & { a: { b: 5 } }
  >
>(true);

// not tuple arrays - change type
assert<Equals<Set<{ a: number[] }, "a.2", "asdf">, { a: (number | "asdf")[] }>>(
  true
);

// should work with unions correctly
// union objects
assert<
  Equals<
    Set<{ a: string } | { b: number }, "a", boolean>,
    | {
        a: boolean;
      }
    | {
        a: boolean;
        b: number;
      }
  >
>(true);

// union arrays
assert<
  Equals<
    Set<["asdf", "fdsa"] | [1, 2, 3], "2", false>,
    ["asdf", "fdsa", false] | [1, 2, false]
  >
>(true);

// union with primitive
assert<
  Equals<
    Set<{ a: ["asdf", "fdsa"] | boolean }, "a.2", false>,
    { a: ["asdf", "fdsa", false] | [undefined, undefined, false] }
  >
>(true);

// union path
assert<
  Equals<
    Set<{ a: number; b: { c: string } }, "a" | "b.c", "value">,
    { a: "value"; b: { c: string } } | { a: number; b: { c: "value" } }
  >
>(true);

// union with union object path
assert<
  Equals<
    Set<
      { a: number; b: { c: string } } | { prop: false },
      "a" | "b.c",
      "value"
    >,
    | { a: "value"; b: { c: string } }
    | { a: number; b: { c: "value" } }
    | { prop: false; a: "value" }
    | { prop: false; b: { c: "value" } }
  >
>(true);

// depth test array
set([[[[[[[[0]]]]]]]], "0.0.0.0.0.0.0", 5);

// depth test object
set(
  {
    a: {
      b: {
        c: {
          d: {
            e: {
              f: {
                g: {
                  h: {
                    i: {
                      j: {
                        k: {
                          l: {
                            m: {
                              n: { o: { p: 5 } },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p",
  5
);
// TODO do we need to preserve readonly when using set?
// assert<
//   Equals<
//     Set<Readonly<{ a: 5; b: 6 }>, ["a"], "asdf">,
//     Readonly<{ a: "asdf"; b: 6 }>
//   >
// >(true);
