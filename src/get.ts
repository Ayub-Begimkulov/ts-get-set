import { PathString, stringToPath } from "./string-to-path";
import { AnyObject, Depth } from "./types";
import { hasOwn, isUndefined, isObject } from "./utils";

export type Get<
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
