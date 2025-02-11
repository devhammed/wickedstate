import {WickedStateMagicContextContract} from '../../utils/contracts';

export function watchMagic<T>({ state, effect, cleanup }: WickedStateMagicContextContract): (
    selector: string,
    fn: (value: T, oldValue: T) => void,
) => void {
  return function watchMagicHandler(
      selector: string,
      fn: (value: T, oldValue: T) => void,
  ): void {
    let currentValue = state.$get(selector);

    let stopWatch = effect(() => {
      let newValue = state.$get(selector);

      if (currentValue !== newValue) {
        fn.call(state, newValue, currentValue);

        currentValue = newValue;
      }
    });

    cleanup(stopWatch);
  };
}
