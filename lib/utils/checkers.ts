export function isObject(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isFunction(value: any): boolean {
  return typeof value === 'function';
}

export function isString(value: any): boolean {
  return typeof value === 'string';
}

export function isArray(value: any): boolean {
  if (typeof Array.isArray === 'function') {
    return Array.isArray(value);
  }

  return Object.prototype.toString.call(value) === '[object Array]';
}
