import {reactivity} from '../reactivity';
import {WickedStateMagicContextContract} from '../../utils/contracts';

export function effectMagic({ state, cleanup }: WickedStateMagicContextContract): (fn: () => void) => void {
  return function effectMagicHandler(fn: () => void): void {
    const effectFn = fn.bind(state);

    const stopEffect = reactivity.effect(effectFn);

    cleanup(stopEffect);
  };
}
