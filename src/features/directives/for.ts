import {
    WickedStateDirectiveContract,
    WickedStateElementContract, WickedStateLoopItemContract
} from '../../utils/contracts';
import {evaluator} from '../evaluator';
import {count, isArray, isNumber, isObject, isString, isSymbol} from '../../utils/checkers';

const DIRECTIVE_VALUE_REGEX = /(?<expression>\([^)]+\)|\w+)\s+in\s+(?<iterableKey>\w+)(?:\s*:\s*(?<itemKey>[\w.]+))?/;

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

        if ( ! isArray(iterable) && ! isObject(iterable)) {
            throw new Error(
                '[WickedState] `for` directive iterable must be an array or an object.',
            );
        }

        if ( ! template.__wickedStateLoopItems) {
            template.__wickedStateLoopItems = [];
        }

        const newLoopItems: WickedStateLoopItemContract[] = [];

        const existingLoopItems: Record<PropertyKey, WickedStateLoopItemContract> = template.__wickedStateLoopItems.reduce(
            (acc, item) => {
                acc[item.key] = item;

                return acc;
            },
            {},
        );

        template.__wickedStateLoopAnchor = template;

        Object.keys(iterable).forEach((key) => {
            const value = iterable[key];

            const itemState = { [valueKey]: value };

            if (indexKey) {
                itemState[indexKey] = key;
            }

            const uniqueKey = itemKey ? evaluator(itemKey, state, itemState) : key;

            if ( ! isString(uniqueKey) && ! isNumber(uniqueKey) && ! isSymbol(uniqueKey)) {
                throw new Error(
                    '[WickedState] `for` directive item key must be a string or number or symbol.',
                );
            }

            const existingItem = existingLoopItems[uniqueKey] ?? null;

            if (existingItem) {
                newLoopItems.push(existingItem);

                delete existingLoopItems[uniqueKey];

                // Reposition the element if it's not in the correct position.
                if (existingItem.el.previousSibling !== template.__wickedStateLoopAnchor) {
                    template.__wickedStateLoopAnchor.after(existingItem.el);
                }

                template.__wickedStateLoopAnchor = existingItem.el;

                return;
            }

            const clone = template.content.cloneNode(true) as DocumentFragment;

            const el = clone.firstElementChild as WickedStateElementContract;

            if ( ! el) {
                throw new Error(
                    '[WickedState] `for` directive template must have a single root element.',
                );
            }

            el.__wickedStateObject = new Proxy({ ...state, ...itemState }, {
                get(_, prop, receiver) {
                    if (prop === valueKey || prop === indexKey) {
                        return itemState[prop];
                    }

                    return Reflect.get(state, prop, receiver);
                },
                set(_, prop, value, receiver) {
                    if (prop === valueKey || prop === indexKey) {
                        return false;
                    }

                    return Reflect.set(state, prop, value, receiver);
                },
            });

            newLoopItems.push({
                el,
                key: uniqueKey,
                value,
            });

            template.__wickedStateLoopAnchor.after(el);

            template.__wickedStateLoopAnchor = el;
        });

        // Remove the elements that are no longer in the loop.
        Object.values(existingLoopItems).forEach((item) => {
            item.el.remove();
        });

        template.__wickedStateLoopItems = newLoopItems;

        template.__wickedStateLoopAnchor = null;
    },
};
