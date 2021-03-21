import { isObject } from "./utils";
import { PathString, stringToPath } from "./string-to-path";
import { AnyObject, Depth } from "./types";
import { SetTuple, GetArrayValue, IsTuple } from "./merge";

export type Set<
  Obj extends AnyObject,
  Path extends string[],
  Value
> = Path["length"] extends 0 ? Obj : Set_<Obj, Path, Value>;

type Set_<
  Obj extends AnyObject,
  Path extends string[],
  Value,
  Index extends number = 0
> = {
  0: Obj extends readonly unknown[]
    ? IsNumericKey<Path[Index]> extends true
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
            | // TODO should we add `undefined`?
            //because if index is greater than length
            // we will have undefined(empty) elements in array
            GetArrayValue<Obj>
            | Set_<
                // TODO make a version for array?
                GetObjectForKey<Obj, number, Path[Depth[Index]]>,
                Path,
                Value,
                Depth[Index]
              >
          )[]
      : // if it's an array but the key isn't numeric create and intersection type with object
        Obj & Set_<{}, Path, Value, Index>
    : {
        [K in keyof Obj | Path[Index]]: K extends Path[Index]
          ? Set_<
              GetObjectForKey<Obj, Path[Index], Path[Depth[Index]]>,
              Path,
              Value,
              Depth[Index]
            >
          : Obj[K];
      }; //SetObject<Obj, Path, Value, Index>;
  1: Value;
}[Index extends Path["length"] ? 1 : 0];

// TODO why do types computed less eagerly when adding this?
/* type SetObject<
  Obj extends AnyObject,
  Path extends string[],
  Value,
  Index extends number
> = {
  [K in keyof Obj | Path[Index]]: K extends Path[Index]
    ? Set_<
        GetObjectForKey<Obj, Path[Index], Path[Depth[Index]]>,
        Path,
        Value,
        Depth[Index]
      >
    : Obj[K];
}; */

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
  let currentObject = object;

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
    (currentObject as AnyObject)[key] = newValue;
    currentObject = currentObject[key];
  }
  return object as any;
};
