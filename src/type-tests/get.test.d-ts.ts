import { Get } from "../get";
import { assert, Equals } from ".";

assert<Equals<Get<{ a: 5 }, ["a"]>, 5>>(true);
