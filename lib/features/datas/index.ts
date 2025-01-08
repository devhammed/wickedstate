let datas: Record<string, Function> = {};

export function data(name: string, callback: Function) {
    datas[name] = callback;
}

export function decorateWithDatas(obj: object, context: object) {
    Object.entries(datas).forEach(([name, callback]) => {
        Object.defineProperty(obj, name, {
            get: () => (...args: any) => callback.bind(context)(...args),
            enumerable: false,
        });
    });

    return obj;
}
