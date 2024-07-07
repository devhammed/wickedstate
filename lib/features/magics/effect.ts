import { MagicContextContract } from '../../utils/contracts';

export function effectMagic({ state, effect }: MagicContextContract): (fn: () => void) => void {
  return function effectMagicHandler(fn: () => void): void {
    effect(fn.bind(state));
  };
}
