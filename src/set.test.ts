import { set } from "./set";

describe("set", () => {
  it("basic", () => {
    const obj = {
      a: 5,
    };
    expect(set(obj, "a", "asdf")).toStrictEqual({ a: "asdf" });
  });

  it("should work with nested objects", () => {
    const obj = {
      a: { b: 5 },
    };
    expect(set(obj, "a.b", 6)).toStrictEqual({ a: { b: 6 } });
  });

  it("should work with arrays", () => {
    const arr = [1, 2, 3];
    expect(set(arr, "1", 4)).toStrictEqual([1, 4, 3]);
    const obj = {
      a: [0, 1, 2],
    };
    expect(set(obj, "a.2", 3)).toStrictEqual({ a: [0, 1, 3] });
  });

  it("should create a key if not present in object", () => {
    const obj = {
      a: 5,
    };
    expect(set(obj, "b", "asdf")).toStrictEqual({ a: 5, b: "asdf" });
  });

  it("should create correct default object for nested paths", () => {
    const obj = { a: 5 };
    expect(set(obj, "a.b.c", "hello world")).toStrictEqual({
      a: { b: { c: "hello world" } },
    });
    // we are using `toEqual` here because index `1`
    // will create empty element, which is not the same as `undefined`
    expect(set({}, "a.1.c", "asdf")).toEqual({
      a: [undefined, { c: "asdf" }],
    });
  });
});
