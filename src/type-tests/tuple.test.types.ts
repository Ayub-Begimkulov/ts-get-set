import { GetTupleRest, IsTuple } from "src/tuple";
import { assert } from ".";

assert<IsTuple<[]>>(true);
assert<IsTuple<"x"[]>>(false);
assert<IsTuple<[0, 1, 2]>>(true);
assert<IsTuple<[0, 1, 2, ...number[]]>>(false);
assert<IsTuple<readonly [1, 2, 3]>>(true);

assert<GetTupleRest<[1, 2, 3], 2>>([3]);
assert<GetTupleRest<readonly [1, 2, 3], 2>>([3]);
