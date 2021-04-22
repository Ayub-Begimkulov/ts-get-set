import { assert, Equals } from "./index";
import { StringToPath } from "../index";

// basic
assert<Equals<StringToPath<"a.b.c.1.d">, ["a", "b", "c", "1", "d"]>>(true);

// empty
assert<Equals<StringToPath<"">, []>>(true);

// empty start
assert<Equals<StringToPath<".a.b.1">, ["a", "b", "1"]>>(true);

// empty center
assert<Equals<StringToPath<"a..b..1">, ["a", "b", "1"]>>(true);

// only dot
assert<Equals<StringToPath<".">, []>>(true);
