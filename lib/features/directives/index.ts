import {onDirective} from './on';
import {textDirective} from './text';
import {DirectiveHandlerContract} from "../../utils/contracts";

export const directives: Record<string, DirectiveHandlerContract<any>> = {
    text: textDirective,
    on: onDirective,
};

export function directive<T>(name: string, fn: DirectiveHandlerContract<T>): void {
    if (typeof directives[name] === 'function') {
        throw new Error(`[WickedState] Overriding directive is not allowed, this error occurred while trying to set an existing directive for ${name}`);
    }

    directives[name] = fn;
}
