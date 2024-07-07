import { decorateWithMagics } from '../magics';
import { evaluate } from '../../utils/evaluate';
import { isFunction } from '../../utils/checkers';
import { defaultReactivity } from '../reactivity';
import {
  WickedStateConfigContract,
  WickedStateDirectiveHandlerContract,
  WickedStateElementContract,
  WickedStateObjectContract,
} from '../../utils/contracts';
import { getStatefulParent } from '../../utils/get-stateful-parent';
import { directives } from '../directives';

export async function start(config: WickedStateConfigContract = {}): Promise<void> {
  const states: NodeListOf<HTMLElement> = document.querySelectorAll(
      '[data-state]',
  );

  if ( ! config.reactivity) {
    config.reactivity = defaultReactivity;
  }

  for (let i = 0; i < states.length; i++) {
    (async function(stateElement): Promise<void> {
      if (stateElement instanceof HTMLTemplateElement) {
        throw new Error(
            '[WickedState] State directive can only be used on non-<template> elements.',
        );
      }

      if (stateElement.__wickedStateObject) {
        return;
      }

      const stateExpression = stateElement.dataset.state;

      if ( ! stateExpression.trim()) {
        return;
      }

      const data = evaluate<object>(stateExpression, {});

      const hydrate = () => start(config);

      const state: WickedStateObjectContract = decorateWithMagics({
        hydrate,
        state: config.reactivity.reactive(data),
        effect: config.reactivity.effect,
        root: stateElement,
      });

      stateElement.__wickedStateObject = state;

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
              el: placeholder,
              previousDisplay: stateElement.style.display,
            };

            stateElement.style.display = 'none';
          }

          try {
            await initValue;
          } finally {
            const placeholder = stateElement.__wickedStatePlaceholder;

            if (placeholder) {
              stateElement.parentElement.removeChild(placeholder.el);

              stateElement.style.display = placeholder.previousDisplay;

              delete stateElement.__wickedStatePlaceholder;
            }
          }
        }
      }

      const walkingNodes: Node[] = [stateElement];

      while (walkingNodes.length) {
        const node = walkingNodes.shift();

        if (node?.childNodes?.length > 0) {
          walkingNodes.unshift.apply(
              walkingNodes,
              [].slice.call(node.childNodes),
          );
        }

        const nodeStateElement = node as WickedStateElementContract;

        if (
            ( ! (node instanceof HTMLElement)) ||
            (stateElement !== node && stateElement.contains(node) &&
                node.dataset.state?.trim()) ||
            (typeof nodeStateElement.__wickedStateDisconnect === 'function')
        ) {
          continue;
        }

        const bindingsExpr: string = node.dataset.bind;

        if ( ! bindingsExpr) {
          continue;
        }

        const cleanups: Set<Function> = new Set();

        const state: WickedStateObjectContract = stateElement.__wickedStateObject;

        const unsubscribeFromEffect = config.reactivity.effect(() => {
          const bindings: Object = evaluate<object>(bindingsExpr, state);

          cleanups.forEach((fx) => {
            fx();
            cleanups.delete(fx);
          });

          for (const key in bindings) {
            if ({}.hasOwnProperty.call(bindings, key)) {
              const value = bindings[key];

              const directive: WickedStateDirectiveHandlerContract<any> | undefined = directives[key];

              if (typeof directive !== 'function') {
                throw new Error(
                    `[WickedState] Unknown directive encountered: ${key}`,
                );
              }

              const cleanup = directive({
                bindings,
                value,
                state,
                hydrate,
                root: stateElement,
                node: nodeStateElement,
                effect: config.reactivity.effect,
              });

              if (isFunction(cleanup)) {
                cleanups.add(cleanup as Function);
              }
            }
          }
        });

        nodeStateElement.__wickedStateDisconnect = function() {
          unsubscribeFromEffect();

          cleanups.forEach((fx) => {
            fx();
            cleanups.delete(fx);
          });

          delete nodeStateElement.__wickedStateDisconnect;
        };
      }
    })(states[i] as WickedStateElementContract);
  }
}
