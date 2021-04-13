import { IsNumericKey } from "./set";
import { PathString, stringToPath } from "./string-to-path";
import { GetArrayValue, IsTuple } from "./tuple";
import { AnyObject, Depth } from "./types";
import { hasOwn, isUndefined, isObject } from "./utils";

export type Get<
  Obj extends AnyObject,
  Path extends string[],
  DefaultValue = undefined
> = Get_<Obj, Path, DefaultValue> extends infer X ? X : never;

type Get_<Value, Path extends string[], Default, Index extends number = 0> = {
  0: Value extends unknown
    ? Value extends AnyObject // we need to check that value is object
      ? Value extends readonly unknown[]
        ? IsNumericKey<Path[Index]> extends true
          ? IsTuple<Value> extends true
            ? Get_<Value[Path[Index]], Path, Default, Depth[Index]>
            : Get_<
                GetArrayValue<Value> | undefined, // adding undefined to value (noUncheckedIndexAccess)
                Path,
                Default,
                Depth[Index]
              >
          : GetKey<Value, Path, Default, Index>
        : GetKey<Value, Path, Default, Index>
      : Default
    : never;
  1: Value extends unknown
    ? Value extends undefined
      ? Default
      : Value
    : never;
}[Index extends Path["length"] ? 1 : 0];

type GetKey<
  Value extends AnyObject,
  Path extends string[],
  Default,
  Index extends number
> = Path[Index] extends keyof Value
  ? Get_<Value[Path[Index]], Path, Default, Depth[Index]>
  : Default;

interface GetFunction {
  <Obj extends AnyObject, Key extends string, Default = undefined>(
    object: Obj,
    stringPath: Key,
    defaultValue?: Default
  ): Get<Obj, PathString<Key>, Default>;
}

// type Test = Get<{ a: [1, 2, { b: number }] }, ["a", "2", "b"]>;

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
