import {reactivity} from '../reactivity';
import { WickedStateMagicContextContract } from '../../utils/contracts';

export function watchMagic<T>({ state }: WickedStateMagicContextContract): (
    selector: () => T,
    fn: (newValue: T, oldValue: T) => void,
) => void {
  return function watchMagicHandler(
      selector: () => T,
      fn: (newValue: T, oldValue: T) => void,
  ): void {
    let value = selector();

    reactivity.effect(() => {
      let newValue = selector();

      if (value !== newValue) {
        fn.call(state, newValue, value);
        value = newValue;
      }
    });
  };
}
