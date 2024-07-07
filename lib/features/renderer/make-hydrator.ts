import {
  WickedStateConfigContract,
  WickedStateNodeContract,
  WickedStateRootContract,
} from '../../utils/contracts';
import { directives } from '../directives';
import { evaluate } from '../../utils/evaluate';
import { isFunction } from '../../utils/checkers';

export function makeHydrator(
    stateElement: WickedStateRootContract,
    config: WickedStateConfigContract,
): () => void {
  return function hydrate() {
    let walkingNodes: Node[] = [stateElement];

    while (walkingNodes.length) {
      const node = walkingNodes.shift();

      if (node?.childNodes?.length > 0) {
        walkingNodes = [].slice.call(node.childNodes).concat(walkingNodes);
      }

      if (
          ( ! (node instanceof HTMLElement)) ||
          (stateElement !== node && stateElement.contains(node) &&
              node.dataset.state?.trim()) ||
          '__wickedStateDisconnect' in node
      ) {
        continue;
      }

      const bindingsExpr = node.dataset.bind;

      if ( ! bindingsExpr) {
        continue;
      }

      const cleanups: Set<Function> = new Set();

      const state = stateElement.__wickedState;

      const unsubscribeFromEffect = config.reactivity.effect(() => {
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
              state,
              hydrate,
              root: stateElement,
              effect: config.reactivity.effect,
              node: node as WickedStateNodeContract,
            });

            if (isFunction(cleanup)) {
              cleanups.add(cleanup as Function);
            }
          }
        }
      });

      (node as WickedStateNodeContract).__wickedStateDisconnect = function() {
        unsubscribeFromEffect();

        cleanups.forEach((fx) => {
          fx();
          cleanups.delete(fx);
        });

        delete (node as WickedStateNodeContract).__wickedStateDisconnect;
      };
    }
  };
}
