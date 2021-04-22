export interface AnyObject {
  [key: string]: any;
}

export interface AnyArray extends ReadonlyArray<unknown> {}

export type Sequence = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export type IsNumericKey<T extends string> = T extends `${number}`
  ? true
  : false;
