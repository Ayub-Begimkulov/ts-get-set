import { isObject } from "./utils";
import { PathString, stringToPath } from "./string-to-path";
import { AnyObject, Depth } from "./types";
import { SetArray, SetTuple, GetArrayValue, IsTuple } from "./merge";

export type Set<Obj extends AnyObject, Path extends string[], Value> =
  // TODO should we remove empty elements?
  Path["length"] extends 0 ? Obj : Set_<Obj, Path, Value>;

type SetObject<Obj extends AnyObject, Key extends string, Value> = {
  [K in keyof Obj | Key]: K extends Key ? Value : Obj[K];
};

type SetShallow<
  T extends AnyObject,
  Key extends string,
  Value
> = T extends unknown
  ? T extends unknown[]
    ? SetArray<T, Key, Value>
    : SetObject<T, Key, Value>
  : never;

type Set_<
  Obj extends AnyObject,
  Path extends string[],
  Value,
  Index extends number = 0
> = {
  0: Obj extends unknown[]
    ? IsTuple<Obj> extends true
      ? SetTuple<
          Obj,
          Path[Index],
          Set_<
            // TODO make a version for array?
            GetObjectForKey<Obj, number, Path[Depth[Index]]>,
            Path,
            Value,
            Depth[Index]
          >
        >
      : (
          | GetArrayValue<Obj>
          | Set_<
              // TODO make a version for array?
              GetObjectForKey<Obj, number, Path[Depth[Index]]>,
              Path,
              Value,
              Depth[Index]
            >
        )[]
    : {
        [K in keyof Obj | Path[Index]]: K extends Path[Index]
          ? Set_<
              GetObjectForKey<Obj, Path[Index], Path[Depth[Index]]>,
              Path,
              Value,
              Depth[Index]
            >
          : Obj[K];
      };
  1: Value;
}[Index extends Path["length"] ? 1 : 0];

type GetObjectForKey<
  Obj extends AnyObject,
  Key extends string | number,
  NextKey extends string
> = Obj[Key] extends AnyObject
  ? Obj[Key]
  : IsNumericKey<NextKey> extends true
  ? []
  : {};

type IsNumericKey<T extends string> = T extends `${number}` ? true : false;

interface SetFunction {
  <Obj extends AnyObject, Key extends string, Value>(
    object: Obj,
    stringPath: Key,
    value: Value
  ): /* asserts object is  */ Set<Obj, PathString<Key>, Value>;
}

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

// TODO check this shit
type Debug = Set<{ a: number[] }, ["a", "2"], "asdf">;
// type Debug2 = Set_<number[], ["2"], "asdf">
type Debug3 = "10" extends `${keyof [1, 2, 3]}` ? true : false;

type TestObject2 = {
  a: number;
  b: { c: number };
};

type TestPath2 = ["b", "c", "1"];

type Test2 = Set<TestObject2, TestPath2, "asdf">;

type Test3 = Set<[{ a: [1, { b: "asdf" }] }], ["0", "a", "1", "b"], "fdsa">;

// TODO if value is array but key isn't array'ish
// @ts-expect-error
type Test4 = Set<[1, 2, 3], ["a", "b"], {}>;

// TODO check this 2 cases
let a = set([1, 2, "a"], "a.b", 5);
let b = set([1, 2, "a"] as const, "a.b", 5);
