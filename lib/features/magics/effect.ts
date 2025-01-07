import {reactivity} from '../reactivity';
import { WickedStateMagicContextContract } from '../../utils/contracts';

export function effectMagic({ state }: WickedStateMagicContextContract): (fn: () => void) => void {
  return function effectMagicHandler(fn: () => void): void {
    reactivity.effect(fn.bind(state));
  };
}
