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
        b: 5,
      },
    };
    expect(get(obj, "a.b")).toBe(5);
  });

  it("arrays", () => {});

  it("works with number keys", () => {});

  it("mixed", () => {});

  it("default", () => {});

  it("should return undefined with empty path", () => {});
  it("should return undefined if path is wrong", () => {});
});
