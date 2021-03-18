// TODO handle empty string
export type PathString<
  StringPath extends string,
  Path extends string[] = []
> = StringPath extends `${infer Key}.${infer Rest}`
  ? PathString<Rest, [...Path, Key]>
  : [...Path, StringPath];

export const stringToPath = <T extends string>(path: T) =>
  path.split(".").filter(Boolean) as PathString<T>;
