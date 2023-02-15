export function clone<T>(value: T): T {
  try {
    if (typeof structuredClone === 'function') {
      return structuredClone(value) as T;
    }

    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}
