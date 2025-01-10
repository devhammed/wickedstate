/**
 * Data providers.
 */
let datas: Record<string, Function> = {};

/**
 * Register a data provider.
 *
 * @example
 * ```ts
 * data('counter', () => ({ count: 0 }));
 * ```
 */
export function data(name: string, callback: Function): void {
    datas[name] = callback;
}

/**
 * Decorate an object with data providers.
 *
 * @example
 * ```ts
 * const obj = {};
 *
 * decorateWithDatas({}, { log: console.log });
 *
 * // Now you can access the data provider like this:
 *
 * const { counter } = obj;
 * ```
 */
export function decorateWithDatas(obj: object, context: object): object {
    Object.entries(datas).forEach(([name, callback]) => {
        Object.defineProperty(obj, name, {
            get: () => (...args: any) => callback.bind(context)(...args),
            enumerable: false,
        });
    });

    return obj;
}
