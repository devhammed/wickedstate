import { WickedStateMagicContextContract } from '../../utils/contracts';

export function effectMagic({ state, effect }: WickedStateMagicContextContract): (fn: () => void) => void {
  return function effectMagicHandler(fn: () => void): void {
    effect(fn.bind(state));
  };
}
