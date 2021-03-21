// TODO handle empty string
export type PathString<StringPath extends string> = PathString_<StringPath>;

type PathString_<
  StringPath extends string,
  Path extends readonly string[] = []
> = StringPath extends `${infer Key}.${infer Rest}`
  ? PathString_<Rest, AppendPath<Path, Key>> //[...Path, Key]
  : AppendPath<Path, StringPath>; //[...Path, StringPath];

type AppendPath<
  Path extends readonly string[],
  PathString extends string
> = PathString extends "" ? Path : [...Path, PathString];

export const stringToPath = <T extends string>(path: T) =>
  path.split(".").filter(Boolean) as PathString<T>;

let a: ["1"] = stringToPath(".1");
let b: [] = stringToPath("");
