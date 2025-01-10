import {reactivity} from '../reactivity';
import {WickedStateMagicContextContract} from '../../utils/contracts';

export function effectMagic({ state, cleanup }: WickedStateMagicContextContract): (fn: () => void) => void {
  return function effectMagicHandler(fn: () => void): void {
    const stateFn = fn.bind(state);

    const stopEffect = reactivity.effect(stateFn);

    cleanup(stopEffect);
  };
}
