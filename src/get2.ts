import { IsNumericKey } from "./set";
import { PathString, stringToPath } from "./string-to-path";
import { AnyObject, Depth } from "./types";
import { hasOwn, isUndefined, isObject } from "./utils";
import { GetArrayValue } from "./tuple";

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
  : Value extends readonly unknown[]
  ? IsNumericKey<Path[Index]> extends true
    ? NotTuple<Value> extends true // value isn't tuple, perform indexing and add `undefined` to the type
      ? Get_<GetArrayValue<Value> | undefined, Path, Default, Depth[Index]>
      : Default
    : Default
  : Default;

interface GetFunction {
  <Obj extends AnyObject, Key extends string, Default = undefined>(
    object: Obj,
    stringPath: Key,
    defaultValue?: Default
  ): Get<Obj, PathString<Key>, Default>;
}

type Test = Get<{ a: { b: string } | { b: number } }, ["a", "b"]>;

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

type NotTuple<T extends readonly unknown[]> = T extends unknown
  ? number extends T["length"]
    ? true
    : false
  : never;
/* type NotTuple<T extends readonly unknown[]> = GetArrayValue<T>[] extends T
  ? true
  : false; */

// const depthTest = get(
//   {
//     a: [
//       1,
//       2,
//       {
//         b: {
//           c: {
//             d: {
//               e: [[[[5]]]],
//               f: { g: { h: { i: { j: { k: { l: { m: 5 } } } } } } },
//             },
//           },
//         },
//       },
//     ],
//   },
//   "a.2.b.c.d.e.0.0.0" // error if we add 1 more
//   // "a.2.b.c.d.f.g.h.i.j.k.l.m" // error if we add 1 more
//   // ["a", "2", "b", "c", "d", "e"]
// );

// type GetWithTupleTest = Get<[1, 2, 3, "asdf", ...number[]], ["6"]>;
