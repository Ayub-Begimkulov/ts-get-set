import { isObject } from "./utils";
import { PathString, stringToPath } from "./string-to-path";
import { AnyObject, Depth } from "./types";
import { SetTuple, GetArrayValue, IsTuple } from "./tuple";

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
              GetObjectForKey<Obj, number, Path[Depth[Index]]>,
              Path,
              Value,
              Depth[Index]
            >
          >
        : (
            | GetArrayValue<Obj>
            | Set_<
                GetObjectForKey<Obj, number, Path[Depth[Index]]>,
                Path,
                Value,
                Depth[Index]
              >
          )[]
      : // if object is an array but the key isn't numeric create and intersection type with object
        Obj & Set_<{}, Path, Value, Index>
    : {
        // writing this type inline because
        // ts preserves type aliases in unions since 4.2
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
> = Obj[Key] extends never
  ? DefaultObject<NextKey>
  : Obj[Key] extends AnyObject
  ? Obj[Key]
  : DefaultObject<NextKey>;

type DefaultObject<Key extends string> = IsNumericKey<Key> extends true
  ? []
  : {};

type IsNumericKey<T extends string> = T extends `${number}` ? true : false;

interface SetFunction {
  <Obj extends AnyObject, Key extends string, Value>(
    object: Obj,
    stringPath: Key,
    value: Value
  ): Set<Obj, PathString<Key>, Value>;
}

export const set: SetFunction = (object, stringPath, value) => {
  let index = -1;
  const path = stringToPath(stringPath);
  const lastIndex = path.length - 1;
  let currentObject = object;

  while (++index <= lastIndex) {
    const key = path[index]!;
    let newValue: any = value;

    if (index !== lastIndex) {
      const objValue = object[key]!;
      newValue = isObject(objValue)
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
