import { watchMagic } from './watch';
import { isFunction } from '../../utils/checkers';
import {
  WickedStateMagicContextContract,
  WickedStateMagicHandlerContract,
} from '../../utils/contracts';
import { rootMagic } from './root';
import { dataMagic } from './data';
import { parentMagic } from './parent';
import { effectMagic } from './effect';
import { refsMagic } from './refs';
import { setMagic } from './set';
import { getMagic } from './get';
import {loopMagic} from "./loop";

export const magics: Record<string, WickedStateMagicHandlerContract<any>> = {
  watch: watchMagic,
  root: rootMagic,
  data: dataMagic,
  parent: parentMagic,
  effect: effectMagic,
  refs: refsMagic,
  set: setMagic,
  get: getMagic,
  loop: loopMagic,
};

export function decorateWithMagics(magicContext: WickedStateMagicContextContract): Object {
  Object.keys(magics).forEach((magicName: string): void => {
    Object.defineProperty(magicContext.state, `$${magicName}`, {
      enumerable: false,
      get: (): any => magics[magicName](magicContext),
    });
  });

  return magicContext.state;
}

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
