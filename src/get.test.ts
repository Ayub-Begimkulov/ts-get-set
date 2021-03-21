import { get } from "./index";

describe("get", () => {
  it("basic", () => {
    const obj = {
      a: 5,
    };
    expect(get(obj, "a")).toBe(5);
  });

  it("nested", () => {
    const obj = {
      a: {
        b: 9,
      },
    };
    expect(get(obj, "a.d", 9)).toBe(9);
  });

  it("arrays", () => {
    const obj = [0, [["a"]]];
    expect(get(obj, "1.0.0")).toBe("a");
    const obj2 = { a: [1, { b: [undefined, "asdf"] }] };
    expect(get(obj2, "a.1.b.1")).toBe("asdf");
  });

  it("should return undefined if path is wrong and not default value", () => {
    const obj = { a: 5 };
    expect(get(obj, "b")).toBe(undefined);
  });

  it("should return default value if provided when path is wrong", () => {
    const obj = { a: 5 };
    expect(get(obj, "b", "asdf")).toBe("asdf");
  });

  it("should return undefined with empty path", () => {});
});
