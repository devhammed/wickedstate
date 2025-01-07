import {
    WickedStateDirectiveContract,
    WickedStateElementContract
} from '../../utils/contracts';
import {evaluator} from '../evaluator';
import {count, isArray, isObject, isString} from '../../utils/checkers';
import {reactivity} from "../reactivity";

const DIRECTIVE_VALUE_REGEX = /(?<expression>\([^)]+\)|\w+)\s+in\s+(?<iterableKey>\w+)(\s+:\s+(?<itemKey>.*))?/;

const EXPRESSION_REGEX = /\((?<value>[^,]+),\s*(?<index>[^)]+)\)|(?<valueOnly>\w+)/;

export const forDirective: WickedStateDirectiveContract = {
    name: 'for',
    priority: 1,
    handler({ node, state, value, bindings }): void {
        if ( ! (node instanceof HTMLTemplateElement)) {
            throw new Error(
                '[WickedState] For directive can only be used on <template> elements.',
            );
        }

        if (count(bindings) > 1) {
            throw new Error(
                '[WickedState] You cannot use other directives with the for directive.',
            );
        }

        const template = node as HTMLTemplateElement & WickedStateElementContract;

        if (template.__wickedStateInLoop) {
            return;
        }

        const match = value.match(DIRECTIVE_VALUE_REGEX);

        if ( ! match) {
            throw new Error(
                '[WickedState] Invalid `for` directive value.',
            );
        }

        const { expression, iterableKey, itemKey } = match.groups;

        const expressionMatch = expression.match(EXPRESSION_REGEX);

        if ( ! expressionMatch) {
            throw new Error(
                '[WickedState] Invalid `for` directive expression.',
            );
        }

        const valueKey = expressionMatch.groups.value || expressionMatch.groups.valueOnly;

        const indexKey = expressionMatch.groups.index || null;

        const iterable = state.$get(iterableKey);

        const previousValue = state.$get(valueKey);

        const previousIndex = indexKey ? state.$get(indexKey) : null;

        if ( ! isArray(iterable) && ! isObject(iterable)) {
            throw new Error(
                '[WickedState] `for` directive iterable must be an array or an object.',
            );
        }

        template.__wickedStateInLoop = true;

        if ( ! template.__wickedStateLoopItems) {
            template.__wickedStateLoopItems = {};
        }

        const newKeys = [];

        Object.keys(iterable).forEach((key, index) => {
            const val = iterable[key];

            newKeys.push(key);

            const itemScope = new Proxy({ ...state, [valueKey]: val, [indexKey]: index }, {
                set(_, prop, value, receiver) {
                    if (prop === valueKey || prop === indexKey) {
                        return false;
                    }

                    return Reflect.set(state, prop, value, receiver);
                },
                get(target, prop) {
                    if (prop === valueKey || prop === indexKey) {
                        return target[prop];
                    }

                    return Reflect.get(state, prop);
                },
            });

            const uniqueKey = itemKey ? evaluator(itemKey, itemScope) : index;

            const previousItem = template.__wickedStateLoopItems[uniqueKey];

            if (previousItem && JSON.stringify(previousItem.value) === JSON.stringify(val)) {
                return;
            }

            const clone = template.content.cloneNode(true) as DocumentFragment;

            const el = clone.firstElementChild as WickedStateElementContract;

            if ( ! el) {
                throw new Error(
                    '[WickedState] `for` directive template must have a single root element.',
                );
            }

            el.__wickedStateObject = itemScope;

            template.__wickedStateLoopItems[uniqueKey] = {
                el,
                key,
                value: val,
            };

            const previousSiblingKey = newKeys[index - 1];

            const previousSibling = previousSiblingKey ? template.__wickedStateLoopItems[previousSiblingKey].el : null;

            if (previousSibling) {
                previousSibling.after(el);
            } else {
                template.after(el);
            }
        });

        template.__wickedStateInLoop = false;

        Object.keys(template.__wickedStateLoopItems).forEach(key => {
            if ( ! newKeys.includes(key)) {
                const item = template.__wickedStateLoopItems[key];

                item.el.remove();

                delete template.__wickedStateLoopItems[key];
            }
        });
    },
};
