import {isObject} from '../../utils/checkers';
import {DirectiveContract} from '../../utils/contracts';

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

export function onDirective({ node, value, state }: DirectiveContract<OnDirective>): void {
    if ( ! isObject(value)) {
        throw new Error(`[WickedState] Event listeners must be an object for ${node}`);
    }

    const el = node as (HTMLElement & {
        __wickedEvents?: Record<string, EventListenerOrEventListenerObject>;
    })

    if ( ! el.__wickedEvents) {
        el.__wickedEvents = {};
    }

    const removeEvent = (target: Window | Document | HTMLElement, event: string) => {
        const handler = el.__wickedEvents[event];

        if (handler) {
            target.removeEventListener(event, handler);
            el.__wickedEvents[event] = null;
        }
    }

    const addEvent = (target: Window | Document | HTMLElement, event: string, handler: EventListenerOrEventListenerObject): void => {
        target.addEventListener(event, handler);
        el.__wickedEvents[event] = handler;
    }

    for (const [event, handler] of Object.entries(value)) {
        const options: OnDirectiveHandler = (isObject(handler) ? handler : {handler}) as OnDirectiveHandler;

        const { prevent, stop, stopImmediate, once, window, document } = options;

        const target = window
            ? globalThis.window
            : (document ? globalThis.document : node);

        removeEvent(target, event);

        if ( ! options.handler) {
            continue;
        }

        addEvent(target, event, function(e: Event): any {
            if (prevent) {
                e.preventDefault();
            }

            if (stop) {
                e.stopPropagation();
            }

            if (stopImmediate) {
                e.stopImmediatePropagation();
            }

            const returnValue = options.handler.call(state, e);

            if (once) {
                removeEvent(target, event);
            }

            return returnValue;
        });
    }
}
