import { watchMagic } from './watch';
import { isFunction } from '../../utils/checkers';
import {
  WickedStateElementContract,
  WickedStateMagicHandlerContract, WickedStateObjectContract,
} from '../../utils/contracts';
import { rootMagic } from './root';
import { dataMagic } from './data';
import { parentMagic } from './parent';
import { effectMagic } from './effect';
import { refsMagic } from './refs';
import { setMagic } from './set';
import { getMagic } from './get';
import { elMagic } from './el';

/**
 * The available magics.
 */
export const magics: Record<string, WickedStateMagicHandlerContract<any>> = {
  watch: watchMagic,
  root: rootMagic,
  data: dataMagic,
  parent: parentMagic,
  effect: effectMagic,
  refs: refsMagic,
  el: elMagic,
  set: setMagic,
  get: getMagic,
};

/**
 * Decorates the state object with the magics.
 */
export function decorateWithMagics(state: WickedStateObjectContract, root: WickedStateElementContract): Object {
  Object.keys(magics).forEach((magicName: string): void => {
    Object.defineProperty(state, `$${magicName}`, {
      enumerable: false,
      get: (): any => magics[magicName]({
        state,
        root,
        cleanup(fn: Function): void {
          const cleanupKey = '_magic_cleanups';

          if ( ! root.__wickedStateCleanups) {
            root.__wickedStateCleanups = {};
          }

          if ( ! root.__wickedStateCleanups[cleanupKey]) {
            root.__wickedStateCleanups[cleanupKey] = [];
          }

          root.__wickedStateCleanups[cleanupKey].push(fn);
        },
      }),
    });
  });

  return state;
}

/**
 * Registers a new magic.
 *
 * @example
 * ```ts
 * import { magic } from 'wickedstate';
 *
 * magic('now', () => new Date());
 * ```
 */
export function magic<T>(
    name: string,
    fn: WickedStateMagicHandlerContract<T>,
): void {
  if (isFunction(magics[name])) {
    throw new Error(
        `[WickedState] Overriding magics is not allowed, this error occurred while trying to set an existing magic for ${name}.`,
    );
  }

  magics[name] = fn;
}
