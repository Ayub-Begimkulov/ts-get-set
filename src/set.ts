import { isObject } from "./utils";
import { StringToPath, stringToPath } from "./string-to-path";
import { AnyArray, AnyObject, Sequence, IsNumericKey } from "./types";
import { SetTuple, GetArrayValue, IsTuple } from "./tuple";

// `StringPath` doesn't get distributed inside `Set_`, do it manually here
export type Set<
  Obj extends AnyObject,
  StringPath extends string,
  Value
> = StringPath extends unknown
  ? Set_<Obj, StringToPath<StringPath>, Value>
  : never;

type Set_<
  Obj extends AnyObject,
  Path extends string[],
  Value,
  Index extends number = 0
> = {
  0: Obj extends AnyArray
    ? IsNumericKey<Path[Index]> extends true
      ? IsTuple<Obj> extends true
        ? SetTuple<
            Obj,
            Path[Index],
            Set_<
              GetNextObject<GetArrayValue<Obj>, Path[Sequence[Index]]>,
              Path,
              Value,
              Sequence[Index]
            >
          >
        : (
            | GetArrayValue<Obj>
            | Set_<
                GetNextObject<GetArrayValue<Obj>, Path[Sequence[Index]]>,
                Path,
                Value,
                Sequence[Index]
              >
          )[]
      : // if object is an array but the key isn't numeric create and intersection type with object
        Obj & Set_<{}, Path, Value, Index>
    : {
        // writing this type inline because
        // ts preserves type aliases in unions since 4.2
        [K in keyof Obj | Path[Index]]: K extends Path[Index]
          ? Set_<
              GetNextObject<Obj[Path[Index]], Path[Sequence[Index]]>,
              Path,
              Value,
              Sequence[Index]
            >
          : Obj[K];
      };
  1: Path["length"] extends 0 ? Obj : Value;
}[Index extends Path["length"] ? 1 : 0];

type GetNextObject<Value, NextKey extends string> = [Value] extends [never]
  ? DefaultObject<NextKey>
  : Value extends AnyObject
  ? Value
  : DefaultObject<NextKey>;

type DefaultObject<Key extends string> = IsNumericKey<Key> extends true
  ? []
  : {};

interface SetFunction {
  <Obj extends AnyObject, Path extends string, Value>(
    object: Obj,
    path: Path,
    value: Value
  ): Set<Obj, Path, Value>;
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
