export function isObject(value: unknown): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isFunction(value: unknown): value is Function {
  return typeof value === 'function';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
    return typeof value === 'number' && ! isNaN(value);
}

export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

export function isArray(value: unknown): value is any[] {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value);
  }

  return Object.prototype.toString.call(value) === '[object Array]';
}

export function count(value: unknown): number {
  if (
      isArray(value)
      || isString(value)
      || value instanceof HTMLCollection
      || value instanceof NodeList
      || value instanceof NamedNodeMap
      || value instanceof FileList
  ) {
    return value.length;
  }

  if (isObject(value)) {
    return Object.keys(value).length;
  }

  if (value instanceof Set || value instanceof Map) {
    return value.size;
  }

  return 0;
}
