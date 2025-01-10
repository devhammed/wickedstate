import {reactivity} from '../reactivity';
import {WickedStateMagicContextContract} from '../../utils/contracts';

export function effectMagic({ root, state }: WickedStateMagicContextContract): (fn: () => void) => void {
  return function effectMagicHandler(fn: () => void): void {
    const effectKey = '_state_effects';

    const unsub = reactivity.effect(fn.bind(state));

    if ( ! root.__wickedStateCleanups) {
      root.__wickedStateCleanups = {};
    }

    if ( ! root.__wickedStateCleanups[effectKey]) {
      root.__wickedStateCleanups[effectKey] = [];
    }

    root.__wickedStateCleanups[effectKey].push(unsub);
  };
}
