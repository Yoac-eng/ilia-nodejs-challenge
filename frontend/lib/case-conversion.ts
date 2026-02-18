function toCamelCaseKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, character: string) => character.toUpperCase());
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function toCamelCaseDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => toCamelCaseDeep(item)) as T;
  }

  if (isPlainObject(value)) {
    const transformed = Object.entries(value).reduce<Record<string, unknown>>(
      (accumulator, [key, nestedValue]) => {
        accumulator[toCamelCaseKey(key)] = toCamelCaseDeep(nestedValue);
        return accumulator;
      },
      {}
    );

    return transformed as T;
  }

  return value;
}

