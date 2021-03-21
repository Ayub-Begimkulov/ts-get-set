import { AnyObject } from "./types";

const hasOwnProperty = Object.prototype.hasOwnProperty;

export const hasOwn = <T extends AnyObject>(
  obj: T,
  key: PropertyKey
): key is keyof T => hasOwnProperty.call(obj, key);

export const isObject = (value: unknown): value is AnyObject =>
  typeof value === "object" && value !== null;

export const isUndefined = (value: unknown): value is undefined =>
  typeof value === "undefined";
