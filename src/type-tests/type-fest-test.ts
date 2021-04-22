import { Get } from "..";
import { expectTypeOf } from "expect-type";

declare const get: <ObjectType, Path extends string>(
  object: ObjectType,
  path: Path
) => Get<ObjectType, Path>;

interface ApiResponse {
  hits: {
    hits: Array<{
      _id: string;
      _source: {
        name: Array<{
          given: string[];
          family: string;
        }>;
        birthDate: string;
      };
    }>;
  };
}

declare const apiResponse: ApiResponse;

expectTypeOf(
  get(apiResponse, "hits.hits.0._source.name.0.given.0")
).toEqualTypeOf<string | undefined>();

// expectTypeOf(get(apiResponse, 'hits.hits[0]._source.name')).toEqualTypeOf<Array<{given: string[]; family: string}>>();
expectTypeOf(get(apiResponse, "hits.hits.0._source.name")).toEqualTypeOf<
  Array<{ given: string[]; family: string }> | undefined
>();

expectTypeOf(
  get(apiResponse, "hits.hits.0._source.name.0.given.0")
).toEqualTypeOf<string | undefined>();

// TypeScript is structurally typed. It's *possible* this value exists even though it's not on the parent interface, so the type is `unknown`.
expectTypeOf(
  get(apiResponse, "hits.someNonsense.notTheRightPath")
).toBeUndefined();

// This interface uses a tuple type (as opposed to an array).
interface WithTuples {
  foo: [
    {
      bar: number;
    },
    {
      baz: boolean;
    }
  ];
}

expectTypeOf<Get<WithTuples, "foo.0.bar">>().toEqualTypeOf<number>();

expectTypeOf<Get<WithTuples, "foo.1.baz">>().toBeBoolean();
expectTypeOf<Get<WithTuples, "foo.1.bar">>().toBeUndefined();

interface WithNumberKeys {
  foo: {
    1: {
      bar: number;
    };
  };
}

// TODO it doesn't support number keys
expectTypeOf<Get<WithNumberKeys, "foo.1.bar">>().toBeNumber();

expectTypeOf<Get<WithNumberKeys, "foo.2.bar">>().toBeUndefined();

// Test `readonly`, `ReadonlyArray`, optional properties, and unions with null.

interface WithModifiers {
  foo: ReadonlyArray<{
    bar?: {
      readonly baz: {
        qux: number;
      };
    };
    abc: {
      def: {
        ghi: string;
      };
    } | null;
  }>;
}

expectTypeOf<Get<WithModifiers, "foo.0.bar.baz">>().toEqualTypeOf<
  { qux: number } | undefined
>();

expectTypeOf<Get<WithModifiers, "foo.0.abc.def.ghi">>().toEqualTypeOf<
  string | undefined
>();
