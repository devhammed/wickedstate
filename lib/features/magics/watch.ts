import { WickedStateMagicContextContract } from '../../utils/contracts';

export function watchMagic<T>({ state, effect }: WickedStateMagicContextContract) {
  return function watchMagicHandler(
      selector: { value: T } | (() => T),
      fn: (newValue: T, oldValue: T) => void,
  ): void {
    let get = (): T => typeof selector === 'object' && 'value' in selector
        ? selector.value
        : selector();

    let value = get();

    effect(() => {
      let newValue = get();

      if (value !== newValue) {
        fn.call(state, newValue, value);
        value = newValue;
      }
    });
  };
}
