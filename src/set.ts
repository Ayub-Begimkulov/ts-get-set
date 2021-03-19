import { isObject } from "./utils";
import { Object } from "../../ts-toolbelt/sources";
import { PathString, stringToPath } from "./string-to-path";
import { AnyObject, Depth } from "./types";

type Set<Obj extends AnyObject, Path extends string[], Value> =
  // TODO should we remove empty elements?
  Path["length"] extends 0 ? Obj : Set_<Obj, Path, Value>;

type Set_<
  Obj extends AnyObject,
  Path extends string[],
  Value,
  Index extends number = 0
> = {
  0: Path[Index] extends keyof Obj
    ? {
        [K in keyof Obj]: K extends Path[Index]
          ? Set_<
              GetObjectForKey<Obj, Path[Index], Path[Depth[Index]]>,
              Path,
              Value,
              Depth[Index]
            >
          : Obj[K];
      }
    : Set_<
        Object.Merge<Obj, GetDefault<Path[Index], undefined>>,
        Path,
        Value,
        Index
      >;
  1: Value;
}[Index extends Path["length"] ? 1 : 0];

type GetDefault<Index extends string, Value> = IsNumericKey<Index> extends true
  ? CreateArray<Value, Index>
  : CreateObject<Index, Value>;

type GetObjectForKey<
  Obj extends AnyObject,
  Key extends string,
  NextKey extends string
> = Obj[Key] extends AnyObject
  ? Obj[Key]
  : IsNumericKey<NextKey> extends true
  ? []
  : {};

type IsNumericKey<T extends string> = T extends `${number}` ? true : false;

type CreateArray<Type, Index extends number | string> = CreateArray_<
  Type,
  Index
>;

type Max = 20;

type CreateObject<Key extends string, Value> = {
  [K in Key]: Value;
};

type CreateArray_<
  Type,
  Index extends number | string,
  Result extends unknown[] = []
> = Result["length"] extends Max
  ? never
  : `${Result["length"]}` extends `${Index}`
  ? [...Result, Type]
  : CreateArray_<Type, Index, [...Result, undefined]>;

type TestObject = {
  a: number;
  b: { c: number };
};

type TestPath = ["b", "c", "1"];

type Test2 = Set<TestObject, TestPath, "asdf">;

type Test3 = Set<[{ a: [1, { b: "asdf" }] }], ["0", "a", "1", "b"], "fdsa">;

interface SetFunction {
  <Obj extends AnyObject, Key extends string, Value>(
    object: Obj,
    stringPath: Key,
    value: Value
  ): /* asserts object is  */ Set<Obj, PathString<Key>, Value>;
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
    let newValue: any = value;

    if (index !== lastIndex) {
      const objValue = object[key]!;
      newValue =
        isObject(objValue) || Array.isArray(objValue)
          ? objValue
          : !isNaN(+path[index + 1]!)
          ? []
          : {};
    }
    (object as AnyObject)[key] = newValue;
    object = object[key];
  }
  return object as any;
};

let a = { a: 5, b: [1, 2, 3] as const };
let b = set(a, "b.2", { c: "d" });

// e.b should not be `any`
let d = { a: 5, b: [1, 2, 3] };
let e = set(a, "b.2", { c: "d" });

let t = set({ a: 5 }, "", 5);
