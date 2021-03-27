import { Depth } from "./types";

export type IsTuple<Tuple extends readonly unknown[]> = Tuple extends unknown
  ? Tuple extends []
    ? true
    : Tuple extends ReadonlyArray<infer U>
    ? U[] extends Tuple
      ? false
      : Tuple extends readonly [unknown, ...infer Rest] // edge case for types like `[1, 2, ...number[]]`
      ? IsTuple<Rest>
      : never
    : never
  : never;

export type GetArrayValue<
  T extends readonly unknown[]
> = T extends ReadonlyArray<infer U> ? U : never;

export type SetTuple<
  A extends readonly unknown[],
  Index extends string,
  Value
> = SetTuple_<A, Index, Value>;

type SetTuple_<
  A extends readonly unknown[],
  Index extends string,
  Value,
  Result extends unknown[] = []
> = {
  0: A["length"] extends Result["length"]
    ? SetTuple_<A, Index, Value, [...Result, undefined]>
    : SetTuple_<A, Index, Value, [...Result, A[Result["length"]]]>;
  1: [...Result, Value, ...GetTupleRest<A, Depth[Result["length"]]>]; // TODO add rest of `A`
}[`${Result["length"]}` extends Index ? 1 : 0];

type GetTupleRest<
  Tuple extends readonly unknown[],
  Index extends number,
  Keys extends string = GetTupleKeys<Tuple>
> = `${Index}` extends Keys ? GetTupleRest_<Tuple, Index, Keys> : [];

type GetTupleRest_<
  Tuple extends readonly unknown[],
  Index extends number,
  Keys extends string,
  Result extends unknown[] = []
> =
  // if we are here, it means that on first run `Tuple["length"]` is higher than `Index`
  // otherwise the check wouldn't pass in `GetTupleRest`
  Tuple["length"] extends Index
    ? Result
    : GetTupleRest_<Tuple, Depth[Index], Keys, [...Result, Tuple[Index]]>;

// TODO dirty way (and most likely not effective from a performance perspective)
// check if we can find other way
type GetTupleKeys<Tuple extends readonly unknown[]> = Extract<
  Exclude<keyof Tuple, number>,
  `${number}`
>;

// Tests
declare function assert<T>(value: T): void;

assert<IsTuple<[]>>(true);
assert<IsTuple<"x"[]>>(false);
assert<IsTuple<[0, 1, 2]>>(true);
assert<IsTuple<[0, 1, 2, ...number[]]>>(false);
assert<IsTuple<readonly [1, 2, 3]>>(true);

assert<GetTupleRest<[1, 2, 3], 2>>([3]);
assert<GetTupleRest<readonly [1, 2, 3], 2>>([3]);
