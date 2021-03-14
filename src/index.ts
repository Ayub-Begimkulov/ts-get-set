interface AnyObject {
  [key: string]: any;
}

// TODO handle empty string
type PathString<
  StringPath extends string,
  Path extends string[] = []
> = StringPath extends `${infer Key}.${infer Rest}`
  ? PathString<Rest, [...Path, Key]>
  : [...Path, StringPath];

type Depth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

type Get<
  Obj extends AnyObject,
  Path extends string[],
  DefaultValue = undefined
> = Get_<Obj, Path, DefaultValue> extends infer X ? X : never;

type Get_<Value, Path extends string[], Default, Index extends number = 0> = {
  0: Path[Index] extends keyof Value
    ? Get_<Value[Path[Index]], Path, Default, Depth[Index]>
    : Default;
  1: Value extends undefined ? Default : Value;
}[Index extends Path["length"] ? 1 : 0];

const stringToPath = <T extends string>(path: T) =>
  path.split(".").filter(Boolean) as PathString<T>;

const hasOwnProperty = Object.prototype.hasOwnProperty;

const hasOwn = <T extends AnyObject>(
  obj: T,
  key: PropertyKey
): key is keyof T => hasOwnProperty.call(obj, key);

const isObject = (value: unknown): value is AnyObject =>
  typeof value === "object" && value !== null;

const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined";

interface GetFunction {
  <Obj extends AnyObject, Key extends string, Default = undefined>(
    object: Obj,
    stringPath: Key,
    defaultValue?: Default
  ): Get<Obj, PathString<Key>, Default>;
}

export const get: GetFunction = (object, stringPath, defaultValue) => {
  const path = stringToPath(stringPath);
  let index = -1;
  const length = path.length;
  const lastIndex = length - 1;
  while (++index < length) {
    const key = path[index]!;
    if (hasOwn(object, key)) {
      if (lastIndex === index) {
        return isUndefined(object[key]) ? defaultValue : object[key];
      }
      if (isObject(object[key])) {
        object = object[key];
      }
    } else {
      return defaultValue;
    }
  }
};

type Set<Obj extends AnyObject, Path extends string[], Value> = Set_<
  Obj,
  Path,
  Value
>;

type Set_<
  Obj extends AnyObject,
  Path extends string[],
  Value,
  Index extends number = 0
> = {
  0: {
    [K in keyof Obj | Path[Index]]: K extends Path[Index]
      ? Set_<GetObjectForKey<Obj, Path[Index]>, Path, Value, Depth[Index]>
      : Obj[K];
  };
  1: Value;
}[Index extends Path["length"] ? 1 : 0];

type GetObjectForKey<
  Obj extends AnyObject,
  Key extends string | number
> = Obj[Key] extends AnyObject
  ? Obj[Key]
  : IsNumericKey<Key> extends true
  ? []
  : {};

type IsNumericKey<T extends string | number> = T extends number
  ? true
  : T extends `${number}`
  ? true
  : false;

type Test2 = Set<{ a: number; b: number }, ["b", "c", "1"], "b">;

interface SetFunction {
  <Obj extends AnyObject, Key extends string, Value>(
    object: Obj,
    stringPath: Key,
    value: Value
  ): object is Set<Obj, PathString<Key>, Value>;
}

/* 

https://www.typescriptlang.org/play?#code/JYWwDg9gTgLgBAbwPICMBWBTAxjANHAGWAGcYBfOAMyghDgHIZiBaGCCAGxQw5noCh+MAJ5gMcAMJQMAQxgYAglCgzhAHn5w4AFVEZcmuAEkAdgBMMADzhX554nBMBXENyhwAPnFJRgJgOYGAHxwALyS0nKKyqoA+mq6YvimFpYhANyCfvJQlDJY4gomwqiYOIiGANoA1hjCAFzeML4BALqNMsWZFIIiYjoQSirq2iHh2jaWdmYOTibVJhAA7iZwAPw6k9Oz84srla3rm43aB3CNJhgAbhjuvXpwALIy1uEATAAMmUIPUrLyQziGi0iX0hhSVi2GHsjhcbk8TRagUMACUMMQnLwoTC5gtliYzuEDvwxnA0RjeJUAEQcaH+GAACyph1s0JmTxecEMG0uNzuWka5MxMEq9FpAUZ9BZUzZDgh1g2lQAdCqhbx8KDDo0-lFAcJ4qDkuYrPhlar0cL8HMLJQ-BgzK0gt8+uJtOiYG8whF-tFhmpnK5bvgAGxBe79ADKGBgeoS2PZuL2BNaRtS8YcAbc+AAajIOE4MKTStgYErHrd-BgEvgdQCYupc-n9MZjWkw+HXe6vVGY-W1JUAIz4N74ADMKbgwfwmduQSAA

*/

export const set: SetFunction = (object, stringPath, value) => {
  let index = -1;
  const path = stringToPath(stringPath);
  const length = path.length;
  const lastIndex = length - 1;

  while (++index < length) {
    const key = path[index]!;
    let newValue = value;

    if (index !== lastIndex) {
      const objValue = object[key]!;
      newValue =
        isObject(objValue) || Array.isArray(objValue)
          ? objValue
          : !isNaN(+path[index + 1]!)
          ? []
          : {};
    }
    object[key] = newValue;
    object = object[key];
  }
  return object;
};
