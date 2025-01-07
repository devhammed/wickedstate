import {WickedStateDirectiveContract} from '../../utils/contracts';
import {evaluator} from "../evaluator";

export const onDirective: WickedStateDirectiveContract = {
  name: 'on',
  priority: 2,
  handler({ node, value, state, modifiers, type }): () => void {

    const removeEvent = () => {
      const event = node.__wickedStateEvents[type];

      if (event) {
        event.target.removeEventListener(type, event.handler);

        node.__wickedStateEvents[type] = null;
      }
    };

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
        removeEvent();
      }

      return returnValue;
    };

    if ( ! node.__wickedStateEvents) {
      node.__wickedStateEvents = {};
    }

    removeEvent();

    target.addEventListener(type, eventHandler);

    node.__wickedStateEvents[type] = {
      target,
      handler: eventHandler,
    };

    return removeEvent;
  },
};
