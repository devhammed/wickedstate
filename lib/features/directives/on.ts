import { isObject } from '../../utils/checkers';
import { WickedStateDirectiveContract } from '../../utils/contracts';

interface OnDirectiveHandler {
  handler: Function;
  prevent?: boolean;
  stop?: boolean;
  stopImmediate?: boolean;
  once?: boolean;
  window?: boolean;
  document?: boolean;
}

interface OnDirective {
  [key: string]: Function | OnDirectiveHandler;
}

export function onDirective({ node, value, state }: WickedStateDirectiveContract<OnDirective>): () => void {
  if ( ! isObject(value)) {
    throw new Error(
        `[WickedState] Event listeners must be an object for ${node}`,
    );
  }

  if ( ! node.__wickedStateEvents) {
    node.__wickedStateEvents = {};
  }

  const removeEvent = (eventName: string) => {
    const event = node.__wickedStateEvents[eventName];

    if (event) {
      event.target.removeEventListener(eventName, event.handler);
      node.__wickedStateEvents[eventName] = null;
    }
  };

  for (const [eventName, eventValue] of Object.entries(value)) {
    const options = (isObject(eventValue)
        ? eventValue
        : { handler: eventValue }) as OnDirectiveHandler;

    const {
      handler,
      prevent,
      stop,
      stopImmediate,
      once,
      window,
      document,
    } = options;

    const target = window
        ? globalThis.window
        : (document ? globalThis.document : node);

    if ( ! handler) {
      continue;
    }

    const eventHandler = function(e: Event): any {
      if (prevent) {
        e.preventDefault();
      }

      if (stop) {
        e.stopPropagation();
      }

      if (stopImmediate) {
        e.stopImmediatePropagation();
      }

      const returnValue = handler.call(state, e);

      if (once) {
        removeEvent(eventName);
      }

      return returnValue;
    };

    target.addEventListener(eventName, eventHandler);

    node.__wickedStateEvents[eventName] = {
      target,
      handler: eventHandler,
    };
  }

  return () => Object.keys(node.__wickedStateEvents).forEach(removeEvent);
}
