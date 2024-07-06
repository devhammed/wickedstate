import { directives } from '../directives';
import { walkDom } from '../../utils/walk-dom';
import { decorateWithMagics } from '../magics';
import { evaluate } from '../../utils/evaluate';
import { isFunction } from '../../utils/checkers';
import { defaultReactivity } from '../reactivity';
import {
  WickedStateConfigContract,
  WickedStateContract,
  WickedStateElementContract,
} from '../../utils/contracts';
import { getStatefulParent } from '../../utils/get-stateful-parent';

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

      const state: WickedStateContract = decorateWithMagics({
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

      walkDom(stateElement, function(node: Node) {
        if (
            ( ! (node instanceof HTMLElement)) ||
            (
                stateElement !== node &&
                stateElement.contains(node) &&
                node.dataset.state?.trim()
            )
        ) {
          return;
        }

        const bindingsExpr = node.dataset.bind;

        if ( ! bindingsExpr) {
          return;
        }

        const cleanups: Set<Function> = new Set();

        config.reactivity.effect(() => {
          const bindings = evaluate<object>(bindingsExpr, state);

          cleanups.forEach((fx) => {
            fx();
            cleanups.delete(fx);
          });

          for (const key in bindings) {
            if ({}.hasOwnProperty.call(bindings, key)) {
              const value = bindings[key];

              const directive = directives[key];

              if (typeof directive !== 'function') {
                throw new Error(
                    `[WickedState] Unknown directive encountered: ${key}`,
                );
              }

              const cleanup = directive({
                bindings,
                value,
                node,
                state,
                root: stateElement,
                effect: config.reactivity.effect,
              });

              if (isFunction(cleanup)) {
                cleanups.add(cleanup as Function);
              }
            }
          }
        });
      }, 0);
    })(states[i] as WickedStateElementContract);
  }
}
