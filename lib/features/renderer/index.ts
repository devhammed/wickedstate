import { decorateWithMagics } from '../magics';
import { evaluate } from '../../utils/evaluate';
import { isFunction } from '../../utils/checkers';
import { defaultReactivity } from '../reactivity';
import {
  WickedStateConfigContract,
  WickedStateContract,
  WickedStateRootContract,
} from '../../utils/contracts';
import { getStatefulParent } from '../../utils/get-stateful-parent';
import { makeHydrator } from './make-hydrator';

export async function start(config: WickedStateConfigContract = {}): Promise<void> {
  const states: NodeListOf<HTMLElement> = document.querySelectorAll(
      '[data-state]',
  );

  if ( ! config.reactivity) {
    config.reactivity = defaultReactivity;
  }

  for (let i = 0; i < states.length; i++) {
    (async function(stateElement): Promise<void> {
      const stateExpression = stateElement.dataset.state;

      if ( ! stateExpression.trim()) {
        return;
      }

      const data = evaluate<object>(stateExpression, {});

      const hydrate = makeHydrator(stateElement, config);

      const state: WickedStateContract = decorateWithMagics({
        hydrate,
        state: config.reactivity.reactive(data),
        effect: config.reactivity.effect,
        root: stateElement,
      });

      stateElement.__wickedState = state;

      stateElement.__wickedStateParent = getStatefulParent(stateElement);

      if (isFunction(state.init)) {
        const initValue = state.init();

        if (initValue instanceof Promise) {
          const placeholderContent = isFunction(state.placeholder)
              ? state.placeholder()
              : null;

          if (placeholderContent) {
            const placeholder = stateElement.cloneNode() as HTMLElement;

            placeholder.removeAttribute('data-state');

            placeholder.removeAttribute('data-bind');

            placeholder.innerHTML = placeholderContent;

            stateElement.parentElement.insertBefore(placeholder, stateElement);

            stateElement.__wickedStatePlaceholder = {
              placeholder,
              previousDisplay: stateElement.style.display,
            };

            stateElement.style.display = 'none';
          }

          try {
            await initValue;
          } finally {
            const placeholderDetails = stateElement.__wickedStatePlaceholder;

            if (placeholderDetails) {
              stateElement.parentElement.removeChild(
                  placeholderDetails.placeholder,
              );
              stateElement.style.display = placeholderDetails.previousDisplay;
              stateElement.__wickedStatePlaceholder = null;
            }
          }
        }
      }

      hydrate();
    })(states[i] as WickedStateRootContract);
  }
}
