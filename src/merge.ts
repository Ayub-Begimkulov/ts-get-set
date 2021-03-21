import { Depth } from "./types";

export type IsTuple<Tuple extends unknown[]> = Tuple extends unknown
  ? Tuple extends []
    ? true
    : Tuple extends Array<infer U>
    ? U[] extends Tuple
      ? false
      : Tuple extends [unknown, ...infer Rest] // edge case for types like `[1, 2, ...number[]]`
      ? IsTuple<Rest>
      : never
    : never
  : never;

// Tests
declare function assert<T>(value: T): void;

assert<IsTuple<[]>>(true);
assert<IsTuple<"x"[]>>(false);
assert<IsTuple<[0, 1, 2]>>(true);
assert<IsTuple<[0, 1, 2, ...number[]]>>(false);

export type SetArray<
  A extends unknown[],
  Index extends string,
  Value
> = A extends unknown
  ? IsTuple<A> extends true
    ? SetTuple<A, Index, Value>
    : // TODO should we add `undefined`?
      //because if index is greater than length
      // we will have undefined(empty) elements in array
      (GetArrayValue<A> | Value)[]
  : never;

export type GetArrayValue<T extends unknown[]> = T extends Array<infer U>
  ? U
  : never;

export type SetTuple<
  A extends unknown[],
  Index extends string,
  Value
> = SetTuple_<A, Index, Value>;

type SetTuple_<
  A extends unknown[],
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
  Tuple extends unknown[],
  Index extends number,
  Keys extends string = GetTupleKeys<Tuple>
> = `${Index}` extends Keys ? GetTupleRest_<Tuple, Index, Keys> : [];

type GetTupleRest_<
  Tuple extends unknown[],
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
type GetTupleKeys<Tuple extends unknown[]> = Extract<
  Exclude<keyof Tuple, number>,
  `${number}`
>;

// Tests
type TestTuple = [1, 2, 3];

assert<GetTupleRest<TestTuple, 2>>([3]);
assert<SetArray<[1, 2, "x"], "1", 5>>([1, 5, "x"]);

assert<SetArray<string[], "1", 5>>(["asdf", 5, "x", "hello world", 5, 5, 5]);
