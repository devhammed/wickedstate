const AsyncFunction = async function () {}.constructor;

export function isAsyncFn(fn: Function): boolean {
  if (typeof fn !== 'function') {
    throw new TypeError(`Expected a function, but got: ${typeof fn}`);
  }

  return fn instanceof AsyncFunction;
}
