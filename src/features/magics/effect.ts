import { WickedStateMagicContextContract } from '../../utils/contracts';

export function effectMagic({ state, effect, cleanup }: WickedStateMagicContextContract): (fn: () => void) => void {
  return function effectMagicHandler(fn: () => void): void {
    const effectFn = fn.bind(state);

    const stopEffect = effect(effectFn);

    cleanup(stopEffect);
  };
}
