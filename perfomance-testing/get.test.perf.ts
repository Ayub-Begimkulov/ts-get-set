import { Get } from "../src/get";

type SmallObject = { a: string; b: number; c: [1, 2, 3]; d: boolean };

type BigObject = {
  a: {
    b: [1, 2, 3];
  };
  c: [
    { d: 5 },
    { d: { e: { f: ["a", "b", { g: "h" }] } } },
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10
  ];
  i: [];
  j: "asdf";
  k: "lemon" | "potato";
};

export type SmallObjectTest1 = Get<SmallObject, "a">;
export type SmallObjectTest2 = Get<SmallObject, "b">;
export type SmallObjectTest3 = Get<SmallObject, "c">;
export type SmallObjectTest4 = Get<SmallObject, "c.2">;
export type SmallObjectTest5 = Get<SmallObject, "d">;

export type BigObjectTest1 = Get<BigObject, "a">;
export type BigObjectTest2 = Get<BigObject, "a.b">;
export type BigObjectTest3 = Get<BigObject, "a.b.2">;
export type BigObjectTest4 = Get<BigObject, "c">;
export type BigObjectTest5 = Get<BigObject, "c.0.d">;
export type BigObjectTest6 = Get<BigObject, "c.1.d">;
export type BigObjectTest7 = Get<BigObject, "c.1.d.e">;
export type BigObjectTest8 = Get<BigObject, "c.1.d.e.f">;
export type BigObjectTest9 = Get<BigObject, "c.1.d.e.f.0">;
export type BigObjectTest10 = Get<BigObject, "c.1.d.e.f.2.g">;
