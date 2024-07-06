import {isFunction} from '../../utils/checkers';
import {MagicContract, MagicHandlerContract} from '../../utils/contracts';

export const magics: Record<string, MagicHandlerContract<any>> = {};

export function decorateWithMagics({ state, effect }: MagicContract): Object {
    return new Proxy(state, {
        get(obj: Object, prop: string): any {
            const magic = magics[prop];

            if (isFunction(magic)) {
                return magic({ state: obj, effect });
            }

            return obj[prop];
        },
        set(obj: Object, prop: string, value: any): boolean {
            if (typeof magics[prop] === 'function') {
                throw new Error(`[WickedState] Overriding magics is not allowed, this error occurred while trying to set an existing magic for ${prop}`);
            }

            obj[prop] = value;

            return true;
        }
    });
}

export function magic<T>(name: string, fn: MagicHandlerContract<T>): void {
    const magicName = `$${name}`;

    if (isFunction(magics[magicName])) {
        throw new Error(`[WickedState] Overriding magics is not allowed, this error occurred while trying to set an existing magic for ${name}`);
    }

    magics[magicName] = fn;
}
