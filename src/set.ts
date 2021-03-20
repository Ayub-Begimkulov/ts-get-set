import { isObject } from "./utils";
import { PathString, stringToPath } from "./string-to-path";
import { AnyObject, Depth } from "./types";
import { SetArray } from "./merge";

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
    : Set_<SetShallow<Obj, Path[Index], undefined>, Path, Value, Index>;
  1: Value;
}[Index extends Path["length"] ? 1 : 0];

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
type Debug3 = "2" extends keyof number[] ? true : false;
