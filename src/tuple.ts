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
  Result extends AnyArray = []
> = {
  0: A["length"] extends Result["length"]
    ? SetTuple_<A, Index, Value, [...Result, undefined]>
    : SetTuple_<A, Index, Value, [...Result, A[Result["length"]]]>;
  1: [...Result, Value, ...GetTupleRest<A, Sequence[Result["length"]]>]; // TODO add rest of `A`
}[`${Result["length"]}` extends Index ? 1 : 0];

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
> =
  // if we are here, it means that on first run `Tuple["length"]` is higher than `Index`
  // otherwise the check wouldn't pass in `GetTupleRest`
  Tuple["length"] extends Index
    ? Result
    : GetTupleRest_<Tuple, Sequence[Index], Keys, [...Result, Tuple[Index]]>;

// TODO dirty way (and most likely not effective from a performance perspective)
// check if we can find other way
type GetTupleKeys<Tuple extends AnyArray> = Extract<keyof Tuple, `${number}`>;
