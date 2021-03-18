import { PathString, stringToPath } from "./string-to-path";
import { hasOwn, isUndefined, isObject } from "./utils";

export interface AnyObject {
  [key: string]: any;
}

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
