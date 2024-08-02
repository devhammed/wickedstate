import {
  WickedStateDirectiveContract,
  WickedStateElementContract,
} from '../../utils/contracts';
import { isArray, isString } from '../../utils/checkers';

export function modelDirective({ node, value: path, state, effect }: WickedStateDirectiveContract<any>): () => void {
  if ( ! isString(path)) {
    throw new Error(
        `[WickedState] Model value must be a string for ${node}`,
    );
  }

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

  const unsubscribeFromState = effect(() => {
    const value = state.$get(path);

    if (isRadio) {
      (target as any).checked = value === target.value;
      return;
    }

    if (isCheckbox) {
      (target as any).checked = isArray(value)
          ? (value as Array<any>).indexOf(target.value) > -1
          : !! value;

      return;
    }

    if (isSelect && target.multiple && isArray(value)) {
      target.selectedIndex = 0;

      [].slice.call(target.options).forEach((option: HTMLOptionElement) => {
        option.selected = (value as Array<any>).indexOf(
            option.value || option.text) > -1;
      });

      return;
    }

    target.value = value as any;
  });

  const eventHandler = function(event: Event) {
    if (event instanceof CustomEvent && typeof event.detail !== 'undefined') {
      state.$set(path, event.detail || (event.target as any).value);
      return;
    }

    state.$set(path, (() => {
      if (isRadio) {
        return (target as any).value;
      }

      if (isCheckbox) {
        const value = state.$get(path);

        if (isArray(value)) {
          return (target as any).checked
              ? (value as Array<any>).concat(target.value).filter(
                  (v: any, i: number, a: Array<any>) => a.indexOf(v) === i,
              )
              : (value as Array<any>).filter(
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
}
