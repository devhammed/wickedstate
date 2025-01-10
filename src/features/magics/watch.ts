import {reactivity} from '../reactivity';
import {WickedStateMagicContextContract} from '../../utils/contracts';

export function watchMagic<T>({ state, cleanup }: WickedStateMagicContextContract): (
    selector: string,
    fn: (value: T, oldValue: T) => void,
) => void {
  return function watchMagicHandler(
      selector: string,
      fn: (value: T, oldValue: T) => void,
  ): void {
    let value = state.$get(selector);

    let stopWatch = reactivity.effect(() => {
      let newValue = state.$get(selector);

      if (value !== newValue) {
        fn.call(state, newValue, value);

        value = newValue;
      }
    });

    cleanup(stopWatch);
  };
}
