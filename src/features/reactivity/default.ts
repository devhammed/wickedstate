import {WickedStateReactivityContract} from '../../utils/contracts';
import {render} from "../renderer";

let activeEffect: Function | null = null;

let disposables: Set<Function> = new Set();

let targetMap: WeakMap<object, Map<PropertyKey, Set<Function>>> = new WeakMap();

function track(target: object, key: PropertyKey): void {
    if (activeEffect) {
        let depsMap = targetMap.get(target);

        if ( ! depsMap) {
            targetMap.set(target, depsMap = new Map());
        }

        let deps = depsMap.get(key);

        if ( ! deps) {
            depsMap.set(key, deps = new Set());
        }

        deps.add(activeEffect);
    }
}

function trigger(target: object, key: PropertyKey): void {
    const depsMap = targetMap.get(target);

    if ( ! depsMap) {
        return;
    }

    const deps = depsMap.get(key);

    if ( ! deps) {
        return;
    }

    disposables.forEach(function(fx) {
        if (deps.has(fx)) {
            deps.delete(fx);
            disposables.delete(fx);
        }
    });

    deps.forEach((fx) => fx());
}

function effect(fn: Function): () => void {
    let previousEffect = activeEffect;

    activeEffect = fn;

    fn();

    activeEffect = previousEffect;

    return () => disposables.add(fn);
}

function reactive(obj: object): Object {
    const state = new Proxy(obj, {
        get(target: Object, key: PropertyKey, receiver: any): any {
            const value = Reflect.get(target, key, receiver);

            if (typeof value === 'function') {
                return value.bind(state);
            }

            track(target, key);

            return value;
        },
        set(target: Object, key: PropertyKey, value: any, receiver: any): boolean {
            const returnValue = Reflect.set(target, key, value, receiver);

            trigger(target, key);

            return returnValue;
        },
    });

    return state;
}

/**
 * Very basic reactivity engine.
 *
 * You can swap this with other engines like `@vue/reactivity`.
 */
export const defaultReactivity: WickedStateReactivityContract = {
    effect,
    reactive,
};
