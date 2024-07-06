export function isObject(value: any): boolean {
  return Object.prototype.toString.call(value) === '[object Object]';
}

export function isFunction(value: any): boolean {
  return typeof value === 'function';
}
