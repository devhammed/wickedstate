import {
  WickedStateDirectiveContract,
  WickedStateElementContract,
} from '../../utils/contracts';
import {evaluator} from '../evaluator';
import {count, isFunction} from '../../utils/checkers';

export const ifDirective: WickedStateDirectiveContract = {
  name: 'if',
  priority: 1,
  handler({ value, node, bindings, state }) {
    const evaluatedValue = evaluator(value, state);

    if ( ! (node instanceof HTMLTemplateElement)) {
      throw new Error(
          '[WickedState] If directive can only be used on <template> elements.',
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
        whenElement.remove();

        template.__wickedStateWhenElement = null;
      }

      return;
    }

    if ( ! template.__wickedStateWhenElement) {
      const clone = template.content.cloneNode(true) as DocumentFragment;

      const firstElementChild = clone.firstElementChild as WickedStateElementContract;

      if ( ! firstElementChild) {
        throw new Error(
            '[WickedState] When directive requires a child element.',
        );
      }

      template.after(firstElementChild);

      template.__wickedStateWhenElement = firstElementChild;
    }
  },
};
