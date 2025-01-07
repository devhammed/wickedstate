import {
  WickedStateDirectiveContract,
  WickedStateElementContract,
} from '../../utils/contracts';
import {count, isFunction} from '../../utils/checkers';
import {evaluator} from "../evaluator";

export const whenDirective: WickedStateDirectiveContract = {
  name: 'when',
  priority: 1,
  handler({ value, node, bindings, state, hydrate }) {
    const evaluatedValue = evaluator(value, state);

    if ( ! (node instanceof HTMLTemplateElement)) {
      throw new Error(
          '[WickedState] When directive can only be used on <template> elements.',
      );
    }

    if (count(bindings) > 1) {
      throw new Error(
          '[WickedState] You cannot use other directives with the when directive.',
      );
    }

    const template = node as WickedStateElementContract & HTMLTemplateElement;

    if ( ! evaluatedValue) {
      const whenElement = template.__wickedStateWhenElement;

      if (whenElement) {
        const destroyHandler = whenElement.__wickedStateObject?.destroy;

        if (isFunction(destroyHandler)) {
          destroyHandler();
        }

        const disconnectHandler = whenElement.__wickedStateDisconnect;

        if (isFunction(disconnectHandler)) {
          disconnectHandler();
        }

        whenElement.remove();

        template.__wickedStateWhenElement = null;
      }

      return;
    }

    if ( !template.__wickedStateWhenElement) {
      const clone = template.content.cloneNode(true) as DocumentFragment;

      const firstElementChild = clone.firstElementChild as WickedStateElementContract;

      if (!firstElementChild) {
        throw new Error(
            '[WickedState] When directive requires a child element.',
        );
      }

      template.after(firstElementChild);

      template.__wickedStateWhenElement = firstElementChild;
    }
  },
};
