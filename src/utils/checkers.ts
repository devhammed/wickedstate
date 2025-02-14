export function isObject(value: any): value is Record<string, any> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
    return typeof value === 'number' && ! isNaN(value);
}

export function isSymbol(value: any): value is symbol {
  return typeof value === 'symbol';
}

export function isArray(value: any): value is any[] {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value);
  }

  return Object.prototype.toString.call(value) === '[object Array]';
}

export function count(value: any): number {
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
