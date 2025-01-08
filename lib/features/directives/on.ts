import {evaluator} from '../evaluator';
import {WickedStateDirectiveContract} from '../../utils/contracts';

export const onDirective: WickedStateDirectiveContract = {
  name: 'on',
  priority: 2,
  handler({ node, value, state, modifiers, type }): void {
    const target = modifiers.window
        ? globalThis.window
        : (modifiers.document ? globalThis.document : node);

    const eventHandler = function(e: Event): any {
      if (modifiers.prevent) {
        e.preventDefault();
      }

      if (modifiers.stop) {
        e.stopPropagation();
      }

      if (modifiers.stopImmediate) {
        e.stopImmediatePropagation();
      }

      const evaluatedValue = evaluator(value, state, { $event: e });

      const returnValue = evaluatedValue instanceof Function
            ? evaluatedValue()
            : evaluatedValue;

      if (modifiers.once) {
        target.removeEventListener(type, eventHandler);

        delete node.__wickedStateEvents[type];
      }

      return returnValue;
    };

    target.addEventListener(type, eventHandler);

    if ( ! node.__wickedStateEvents) {
      node.__wickedStateEvents = {};
    }

    node.__wickedStateEvents[type] = {
      target,
      handler: eventHandler,
    };
  },
};
