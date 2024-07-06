import {watchMagic} from './watch';
import {isFunction} from '../../utils/checkers';
import {MagicContract, MagicHandlerContract} from '../../utils/contracts';

export const magics: Record<string, MagicHandlerContract<any>> = {
    $watch: watchMagic,
};

export function decorateWithMagics({ state, effect }: MagicContract): Object {
    Object.keys(magics).forEach((magicName: string): void => {
        Object.defineProperty(state, magicName, {
            set(_: any): void {
                throw new Error(`[WickedState] You cannot set a value of a magic, this error occurred while trying to set a value for ${magicName}`);
            },
            get(): any {
                return magics[magicName]({ state, effect });
            }
        });
    });

    return state;
}

export function magic<T>(name: string, fn: MagicHandlerContract<T>): void {
    const magicName = `$${name}`;

    if (isFunction(magics[magicName])) {
        throw new Error(`[WickedState] Overriding magics is not allowed, this error occurred while trying to set an existing magic for ${name}`);
    }

    magics[magicName] = fn;
}
