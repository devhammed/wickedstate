import {
  WickedStateDirectiveContract,
  WickedStateElementContract,
} from '../../utils/contracts';
import {reactivity} from '../reactivity';
import { isArray } from '../../utils/checkers';

export const modelDirective: WickedStateDirectiveContract = {
  name: 'model',
  priority: 2,
  handler({ node, value, state }): () => void {
    const target = node as ((HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement) & WickedStateElementContract);

    const isInput = target instanceof HTMLInputElement;

    const isCheckbox = isInput && target.type ===
        'checkbox';

    const isRadio = isInput && target.type === 'radio';

    const isSelect = target instanceof HTMLSelectElement;

    const eventName =
        isInput && ! (isCheckbox || isRadio || isSelect)
            ? 'input'
            : 'change';

    const unsubscribeFromState = reactivity.effect(() => {
      const stateValue = state.$get(value);

      if (isRadio) {
        (target as any).checked = stateValue === target.value;
        return;
      }

      if (isCheckbox) {
        (target as any).checked = isArray(stateValue)
            ? (stateValue as Array<any>).indexOf(target.value) > -1
            : !! stateValue;

        return;
      }

      if (isSelect && target.multiple && isArray(stateValue)) {
        target.selectedIndex = 0;

        [].slice.call(target.options).forEach((option: HTMLOptionElement) => {
          option.selected = (stateValue as Array<any>).indexOf(
              option.value || option.text) > -1;
        });

        return;
      }

      target.value = stateValue as any;
    });

    const eventHandler = function(event: Event) {
      if (event instanceof CustomEvent && typeof event.detail !== 'undefined') {
        state.$set(value, event.detail || (event.target as any).value);
        return;
      }

      state.$set(value, (() => {
        if (isRadio) {
          return (target as any).value;
        }

        if (isCheckbox) {
          const stateValue = state.$get(value);

          if (isArray(stateValue)) {
            return (target as any).checked
                ? (stateValue as Array<any>).concat(target.value).filter(
                    (v: any, i: number, a: Array<any>) => a.indexOf(v) === i,
                )
                : (stateValue as Array<any>).filter(
                    (v: any) => v !== target.value,
                );
          }

          return (target as any).checked;
        }

        if (isSelect && target.multiple) {
          return [].slice.call(target.selectedOptions).
          map((option: HTMLOptionElement) => option.value || option.text);
        }

        return (target as any).value;
      })());
    };

    node.addEventListener(eventName, eventHandler);

    return () => {
      unsubscribeFromState();
      node.removeEventListener(eventName, eventHandler);
    };
  },
};
