import {reactivity} from '../reactivity';
import {directives} from '../directives';
import {isFunction} from '../../utils/checkers';
import {WickedStateDirectiveBindingContract, WickedStateElementContract} from '../../utils/contracts';

function getStateRoot(node: WickedStateElementContract): WickedStateElementContract|null {
    let parent = node;

    while (parent) {
        if (parent.__wickedStateObject) {
            return parent;
        }

        parent = parent.parentElement;
    }

    return null;
}

export async function domRenderer(root: any): Promise<void> {
    const directiveRegex = /\*(?<name>[\w-]+)(?:\[(?<type>[^\]]*)])?.?(?<modifiers>(?:[\w-]+(?:\[[^\]]*])?(?:\.[\w-]+(?:\[[^\]]*])?)*)?)?/;

    const modifiersRegex = /(?<name>[\w-]+)(?:\[(?<args>[^\]]*)])?/;

    const walkingNodes: Node[] = [root];

    while (walkingNodes.length) {
        const node = walkingNodes.shift();

        if (node?.childNodes?.length > 0) {
            walkingNodes.unshift.apply(
                walkingNodes,
                [].slice.call(node.childNodes),
            );
        }

        if (!(node instanceof HTMLElement)) {
            continue;
        }

        const bindings: WickedStateDirectiveBindingContract[] = [];

        const attributes = node.attributes;

        const attributesLength = attributes.length;

        for (let i = 0; i < attributesLength; i++) {
            const attribute = attributes[i];

            const directive = directiveRegex.exec(attribute.name);

            if (!directive) {
                continue;
            }

            const name = directive.groups.name ?? null;

            if (!name) {
                continue;
            }

            const registeredDirective = directives.find((directive) => directive.name === name);

            if (!registeredDirective) {
                throw new Error(`Directive ${name} is not registered.`);
            }

            const type = directive.groups.type ?? name;

            const modifiers = (directive.groups.modifiers ?? '').split('.').reduce((acc, modifier) => {
                const match = modifiersRegex.exec(modifier);

                if (!match) {
                    return acc;
                }

                const name = match.groups.name ?? null;

                if (!name) {
                    return acc;
                }

                acc[name] = match.groups.args ?? true;

                return acc;
            }, {});

            bindings.push({
                name,
                type,
                modifiers,
                value: attribute.value,
                handler: registeredDirective.handler,
            });
        }

        const bindingsLength = bindings.length;

        const cleanups: Function[] = [];

        for (let i = 0; i < bindingsLength; i++) {
            const binding = bindings[i];

            const stateRoot = getStateRoot(node);

            const state = stateRoot?.__wickedStateObject;

            const unsubscribeFromEffect = reactivity.effect(() => {
                if (stateRoot) {
                    stateRoot.__wickedStateCurrentElement = node;
                }

                while (cleanups.length) {
                    cleanups.shift()();
                }

                const cleanup = binding.handler({
                    bindings,
                    state,
                    node,
                    root: stateRoot,
                    type: binding.type,
                    value: binding.value,
                    modifiers: binding.modifiers,
                });

                if (isFunction(cleanup)) {
                    cleanups.push(cleanup as Function);
                }
            });

            (node as WickedStateElementContract).__wickedStateDisconnect = function () {
                unsubscribeFromEffect();

                while (cleanups.length) {
                    cleanups.shift()();
                }
            };
        }
    }

    if (!root.__wickedObserved && !root.__wickedStateDisconnect) {
        const observer = new MutationObserver((mutations) => {
            const nodes = mutations.reduce((acc, mutation) => {
                acc.removed.push.apply(acc.removed, [].slice.call(mutation.removedNodes));

                acc.added.push.apply(acc.added, [].slice.call(mutation.addedNodes));

                return acc;
            }, {added: [], removed: []});

            if (nodes.added.length) {
                domRenderer(root);
            }

            nodes.removed.forEach((node) => {
                if (!(node instanceof HTMLElement)) {
                    return;
                }

                const element = node as WickedStateElementContract;

                const elementState = element.__wickedStateObject;

                const destroyHandler = elementState?.destroy;

                if (isFunction(destroyHandler)) {
                    destroyHandler.call(elementState);
                }

                const disconnectHandler = element.__wickedStateDisconnect;

                if (isFunction(disconnectHandler)) {
                    disconnectHandler.call(element);
                }
            });
        });

        observer.observe(root, { childList: true, subtree: true });

        root.__wickedObserved = true;

        root.__wickedStateDisconnect = function () {
            observer.disconnect();
        };
    }
}
