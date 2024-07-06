import {isObject} from '../../utils/checkers';
import {DirectiveContract} from '../../utils/contracts';

interface OnDirectiveHandler {
    handler: Function;
    once?: boolean;
    prevent?: boolean;
    stop?: boolean;
    stopImmediate?: boolean;
}

interface OnDirective {
    [key: string]: Function | OnDirectiveHandler;
}

export function onDirective({ node, value, state }: DirectiveContract<OnDirective>): void {
    if ( ! isObject(value)) {
        throw new Error(`[WickedState] Event listeners must be an object for ${node}`);
    }

    for (const [event, handler] of Object.entries(value)) {
        const options: OnDirectiveHandler = (isObject(handler) ? handler : {handler}) as OnDirectiveHandler;

        const { once, prevent, stop, stopImmediate } = options;

        node.addEventListener(event, function wickedOnHandler(e: Event){
            if (prevent) {
                e.preventDefault();
            }

            if (stop) {
                e.stopPropagation();
            }

            if (stopImmediate) {
                e.stopImmediatePropagation();
            }

            options.handler.call(state, e);

            if (once) {
                node.removeEventListener(event, wickedOnHandler);
            }
        });
    }
}
