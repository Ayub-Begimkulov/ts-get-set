import { PathString, stringToPath } from "./string-to-path";
import { AnyArray, AnyObject, Depth, IsNumericKey } from "./types";
import { hasOwn, isUndefined, isObject } from "./utils";
import { GetArrayValue, IsTuple } from "./tuple";

export type Get<
  Value extends AnyObject,
  Path extends string[],
  Default = undefined
> = Get_<Value, Path, Default>;

type Get_<
  Value,
  Path extends string[],
  Default = undefined,
  Index extends number = 0
> = {
  0: Value extends AnyObject ? GetKey<Value, Path, Default, Index> : Default;
  1: Value extends undefined ? Default : Value;
}[Index extends Path["length"] ? 1 : 0];

type GetKey<
  Value extends AnyObject,
  Path extends string[],
  Default,
  Index extends number
> = Path[Index] extends keyof Value
  ? Get_<Value[Path[Index]], Path, Default, Depth[Index]>
  : Value extends AnyArray
  ? IsNumericKey<Path[Index]> extends false
    ? Default
    : IsTuple<Value> extends true
    ? Default
    : // value isn't tuple, get array value and
      // add `undefined` to it (similar to `noUncheckedIndexAccess`)
      Get_<GetArrayValue<Value> | undefined, Path, Default, Depth[Index]>
  : Default;

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
  const lastIndex = path.length - 1;
  while (++index <= lastIndex) {
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
  return object;
};
