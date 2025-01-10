import {reactivity} from '../reactivity';
import {WickedStateMagicContextContract} from '../../utils/contracts';

export function watchMagic<T>({ root, state }: WickedStateMagicContextContract): (
    selector: string,
    fn: (value: T, oldValue: T) => void,
) => void {
  return function watchMagicHandler(
      selector: string,
      fn: (value: T, oldValue: T) => void,
  ): void {
    let value = state.$get(selector);

    let unsub = reactivity.effect(() => {
      let newValue = state.$get(selector);

      if (value !== newValue) {
        fn.call(state, newValue, value);
        value = newValue;
      }
    });

    if ( ! root.__wickedStateCleanups) {
      root.__wickedStateCleanups = {};
    }

    if ( ! root.__wickedStateCleanups[selector]) {
      root.__wickedStateCleanups[selector] = [];
    }

    root.__wickedStateCleanups[selector].push(unsub);
  };
}
