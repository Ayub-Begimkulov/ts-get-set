import { assert, Equals } from "./index";
import { PathString } from "../index";

// basic
assert<Equals<PathString<"a.b.c.1.d">, ["a", "b", "c", "1", "d"]>>(true);

// empty
assert<Equals<PathString<"">, []>>(true);

// empty start
assert<Equals<PathString<".a.b.1">, ["a", "b", "1"]>>(true);

// empty center
assert<Equals<PathString<"a..b..1">, ["a", "b", "1"]>>(true);

// only dot
assert<Equals<PathString<".">, []>>(true);
