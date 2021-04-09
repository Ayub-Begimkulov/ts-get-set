import { get } from "./index";

describe("get", () => {
  it("basic", () => {
    const obj = {
      a: 5,
    };
    expect(get(obj, "a")).toBe(5);
  });

  it("should work with nested objects", () => {
    const obj = {
      a: {
        b: 9,
      },
    };
    expect(get(obj, "a.b")).toBe(9);
  });

  it("should work with arrays", () => {
    const obj = [0, [["a"]]];
    expect(get(obj, "1.0.0")).toBe("a");
    const obj2 = { a: [1, { b: [undefined, "asdf"] }] };
    expect(get(obj2, "a.1.b.1")).toBe("asdf");
  });

  it("should return undefined if path is wrong and no default value", () => {
    const obj = { a: 5 };
    expect(get(obj, "b")).toBe(undefined);
    expect(get(obj, "a.b")).toBe(undefined);
  });

  it("should return default value if provided when path is wrong", () => {
    const obj = { a: 5 };
    expect(get(obj, "b", "asdf")).toBe("asdf");
    expect(get(obj, "a.b", "asdf")).toBe("asdf");
  });

  it("should return default value if provided when value is `undefined`", () => {
    const obj = { a: 5, b: undefined };
    expect(get(obj, "b", "asdf")).toBe("asdf");
  });

  it("should return object with empty path", () => {
    const obj = { a: 5 };
    expect(get(obj, "")).toStrictEqual({ ...obj });
  });
});
