interface AnyObject {
  [key: string]: any;
}

type PathString<
  StringPath extends string,
  Path extends string[] = []
> = StringPath extends `${infer Key}.${infer Rest}`
  ? PathString<Rest, [...Path, Key]>
  : [...Path, StringPath];

type Get<
  T extends AnyObject,
  Path extends string[],
  DefaultValue = undefined,
  Index extends unknown[] = []
> = Path[Index["length"]] extends keyof T
  ? Get<T[Path[Index["length"]]], Path, DefaultValue, [unknown, ...Index]>
  : Index["length"] extends Path["length"]
  ? T
  : DefaultValue;

// TODO fix this
// @ts-ignore
type Test = PathString<"a..b">;

function test<T = undefined>(a?: T) {
  return a;
}

const a = test();
const b = test(5);

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

declare function g<
  Obj extends AnyObject,
  Key extends string,
  Default = undefined
>(
  object: Obj,
  stringPath: Key,
  defaultValue?: Default
): Get<Obj, PathString<Key>, Default>;

const GetTest1 = g({ a: 5 }, "a.b");
// @ts-ignore add test for unknown if path is wrong
const GetTest2 = get({ a: 5 }, "a.b");

export const get = <
  Obj extends AnyObject,
  Key extends string,
  Default = undefined
>(
  object: Obj,
  stringPath: Key,
  defaultValue?: Default
): Get<Obj, PathString<Key>, Default> => {
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
  return;
};
