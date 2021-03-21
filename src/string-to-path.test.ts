import { stringToPath } from "./string-to-path";

describe("stringToPath", () => {
  it("basic", () => {
    expect(stringToPath("a.b.1.c")).toStrictEqual(["a", "b", "1", "c"]);
  });

  it("should skip empty paths", () => {
    expect(stringToPath("a..b..c")).toStrictEqual(["a", "b", "c"]);
    expect(stringToPath(".b")).toStrictEqual(["b"]);
    expect(stringToPath(".")).toStrictEqual([]);
    expect(stringToPath("")).toStrictEqual([]);
  });
});
