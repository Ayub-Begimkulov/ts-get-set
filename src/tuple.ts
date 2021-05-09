import { AnyArray, Sequence } from "./types";

// Tuple arrays have literal indexes (e.g. 5)
// we could use it to detect whether
// array is tuple or not
export type IsTuple<T extends AnyArray> = number extends T["length"]
  ? false
  : true;

export type GetArrayValue<T extends AnyArray> = T extends ReadonlyArray<infer U>
  ? U
  : never;

export type SetTuple<
  A extends AnyArray,
  Index extends string,
  Value
> = SetTuple_<A, Index, Value>;

type SetTuple_<
  A extends AnyArray,
  Index extends string,
  Value,
  Result extends AnyArray = [],
  CurrentIndex extends number = Result["length"]
> = {
  0: SetTuple_<A, Index, Value, [...Result, A[CurrentIndex]]>;
  1: [...Result, Value, ...GetTupleRest<A, Sequence[CurrentIndex]>];
}[`${CurrentIndex}` extends Index ? 1 : 0];

export type GetTupleRest<
  Tuple extends AnyArray,
  Index extends number,
  Keys extends string = GetTupleKeys<Tuple>
> = `${Index}` extends Keys ? GetTupleRest_<Tuple, Index, Keys> : [];

type GetTupleRest_<
  Tuple extends AnyArray,
  Index extends number,
  Keys extends string,
  Result extends AnyArray = []
> = Tuple["length"] extends Index
  ? Result
  : GetTupleRest_<Tuple, Sequence[Index], Keys, [...Result, Tuple[Index]]>;

type GetTupleKeys<Tuple extends AnyArray> = Extract<keyof Tuple, `${number}`>;
