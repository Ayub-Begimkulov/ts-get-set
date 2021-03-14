import { Object } from "../../ts-toolbelt/sources";

interface AnyObject {
  [key: string]: any;
}

type Depth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

type Set<Obj extends AnyObject, Path extends string[], Value> = Set_<
  Obj,
  Path,
  Value
>;

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
    : Set_<
        Object.Merge<Obj, GetDefault<Path[Index], undefined>, "deep">,
        Path,
        Value,
        Index
      >;
  1: Value;
}[Index extends Path["length"] ? 1 : 0];

type GetDefault<Index extends string, Value> = IsNumericKey<Index> extends true
  ? CreateArray<Value, Index>
  : CreateObject<Index, Value>;

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

type CreateArray<Type, Index extends number | string> = CreateArray_<
  Type,
  Index
>;

type Max = 20;

type CreateObject<Key extends string, Value> = {
  [K in Key]: Value;
};

type CreateArray_<
  Type,
  Index extends number | string,
  Result extends unknown[] = []
> = Result["length"] extends Max
  ? never
  : `${Result["length"]}` extends `${Index}`
  ? [...Result, Type]
  : CreateArray_<Type, Index, [...Result, undefined]>;

type TestObject = {
  a: number;
  b: { c: number };
};

type TestPath = ["b", "c", "1"];

type Test2 = Set<TestObject, TestPath, "asdf">;
