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
    expect(get(obj, "a.d", 9)).toBe(5);
  });

  it("arrays", () => {
    const obj = [0, [["a"]]] as const;
    expect(get(obj, "1.0.0")).toBe("a");
  });

  it("works with number keys", () => {});

  it("mixed", () => {});

  it("default", () => {});

  it("should return undefined with empty path", () => {});
  it("should return undefined if path is wrong", () => {});
});
