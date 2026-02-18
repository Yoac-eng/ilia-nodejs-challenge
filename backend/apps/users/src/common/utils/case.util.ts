function toSnakeCaseKey(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

export function toSnakeCaseDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => toSnakeCaseDeep(item)) as T;
  }

  if (isPlainObject(value)) {
    const transformed = Object.entries(value).reduce<Record<string, unknown>>(
      (accumulator, [key, nestedValue]) => {
        accumulator[toSnakeCaseKey(key)] = toSnakeCaseDeep(nestedValue);
        return accumulator;
      },
      {},
    );

    return transformed as T;
  }

  return value;
}
