import { watchMagic } from './watch';
import { isFunction } from '../../utils/checkers';
import {
  MagicContextContract,
  MagicHandlerContract,
} from '../../utils/contracts';
import { rootMagic } from './root';
import { dataMagic } from './data';
import { parentMagic } from './parent';

export const magics: Record<string, MagicHandlerContract<any>> = {
  $watch: watchMagic,
  $root: rootMagic,
  $data: dataMagic,
  $parent: parentMagic,
};

export function decorateWithMagics(magicContext: MagicContextContract): Object {
  Object.keys(magics).forEach((magicName: string): void => {
    Object.defineProperty(magicContext.state, magicName, {
      set(_: any): void {
        throw new Error(
            `[WickedState] You cannot set a value of a magic, this error occurred while trying to set a value for ${magicName}.`,
        );
      },
      get(): any {
        return magics[magicName](magicContext);
      },
    });
  });

  return magicContext.state;
}

export function magic<T>(name: string, fn: MagicHandlerContract<T>): void {
  const magicName = `$${name}`;

  if (isFunction(magics[magicName])) {
    throw new Error(
        `[WickedState] Overriding magics is not allowed, this error occurred while trying to set an existing magic for ${name}`,
    );
  }

  magics[magicName] = fn;
}
