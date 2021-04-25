export type StringToPath<StringPath extends string> = StringToPath_<StringPath>;

type StringToPath_<
  StringPath extends string,
  Path extends string[] = []
> = StringPath extends `${infer Key}.${infer Rest}`
  ? StringToPath_<Rest, AppendPath<Path, Key>>
  : AppendPath<Path, StringPath>;

type AppendPath<Path extends string[], Item extends string> = Item extends ""
  ? Path
  : [...Path, Item];

export const stringToPath = <T extends string>(path: T) =>
  path.split(".").filter(Boolean) as StringToPath<T>;
