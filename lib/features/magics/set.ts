import { WickedStateMagicContextContract } from '../../utils/contracts';
import { isObject } from '../../utils/checkers';

export function setMagic({ state }: WickedStateMagicContextContract): (
    path: string, value: any,
) => void {
  return function setMagicHandler(path: string, value: any): void {
    const paths = path.replace(/\[(\w+)]/g, '.$1').
        replace(/^\./, '').
        split('.');

    const firstPath = paths.shift();

    if ( ! firstPath) {
      return null;
    }

    let target = state[firstPath];

    if ( ! isObject(target)) {
      return state[firstPath] = value;
    }

    state[firstPath] = paths.reduce((acc, path, index) => {
      if (index === paths.length - 1) {
        acc[path] = value;
        return acc;
      }

      if ( ! acc[path]) {
        acc[path] = {};
      }

      return acc[path];
    }, target);
  };
}
