import { get, Get } from "../get";
import { assert, Equals } from ".";

// simple
assert<Equals<Get<{ a: 5 }, "a">, 5>>(true);

// arrays
assert<Equals<Get<[1, 2, 3], "2">, 3>>(true);

// mixed
assert<Equals<Get<{ a: [1, { b: ["a", "b"] }, 3] }, "a.1.b.1">, "b">>(true);

// wrong path
assert<Equals<Get<{ a: 5 }, "b">, undefined>>(true);

// default value
assert<Equals<Get<{ a: 5 }, "b", "asdf">, "asdf">>(true);

// default value with undefined
assert<Equals<Get<{ a: 5; b: undefined }, "b", "asdf">, "asdf">>(true);

// default value with undefined in union
assert<
  Equals<Get<{ a: 5; b: number | undefined }, "b", "asdf">, number | "asdf">
>(true);

// should work with unions correctly
// union objects
assert<Equals<Get<{ a: number } | { a: string }, "a">, string | number>>(true);

// union arrays
assert<Equals<Get<{ a: { "2": "hello" } | [1, 2, 3] }, "a.2">, 3 | "hello">>(
  true
);

// union path
assert<
  Equals<Get<{ a: number; b: { c: string } }, "a" | "b.c">, string | number>
>(true);

// union path and value
assert<
  Equals<
    Get<
      { a: number; b: { c: string } } | { a: symbol; b: { c: boolean } },
      "a" | "b.c"
    >,
    string | number | symbol | boolean
  >
>(true);

// should add undefined if one of union types is primitive
assert<Equals<Get<{ a: number | [1, 2, 3] }, "a.2">, 3 | undefined>>(true);

// union type should add undefined for arrays (noUncheckIndexAccess)
assert<Equals<Get<{ a: number[] }, "a.2">, number | undefined>>(true);

// regular arrays, primitive union
assert<
  Equals<
    Get<{ a: (number | { b: number })[] }, "a.2">,
    number | { b: number } | undefined
  >
>(true);

// should work correctly with tuplish arrays
// assert<Equals<Get<[1, "2", ...string[]], ["3"]>, string | /* 1 | */ undefined>>(
//   true
// );

// depth test for arrays, should not give recursion errors
get([[[[[[[[[0]]]]]]]]], "0.0.0.0.0.0.0.0"); // error if we add one more key

// depth test for objects, should not give recursion errors
get(
  {
    a: {
      b: {
        c: {
          d: {
            e: {
              f: {
                g: {
                  h: { i: { j: { k: { l: { m: { n: { o: 5 } } } } } } },
                },
              },
            },
          },
        },
      },
    },
  },
  "a.b.c.d.e.f.g.h.i.j.k.l.m.n" // error if we add 1 more
);
