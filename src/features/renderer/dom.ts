import {prefix} from './index';
import {reactivity} from '../reactivity';
import {directives} from '../directives';
import {isFunction, isObject} from '../../utils/checkers';
import {WickedStateDirectiveBindingContract, WickedStateElementContract} from '../../utils/contracts';

/**
 * Get the nearest state root element.
 */
function getStateRoot(element: WickedStateElementContract): WickedStateElementContract | null {
    if (element.__wickedStateObject) {
        return element;
    }

    if (element.parentElement) {
        return getStateRoot(element.parentElement);
    }

    return null;
}

/**
 * Get cleanups array.
 */
function getCleanups(node: WickedStateElementContract, type: string): Function[] {
    if ( ! node.__wickedStateCleanups) {
        node.__wickedStateCleanups = {};
    }

    if ( ! node.__wickedStateCleanups[type]) {
        node.__wickedStateCleanups[type] = [];
    }

    return node.__wickedStateCleanups[type];
}

/**
 * DOM renderer.
 *
 * This function is responsible for applying directives to the DOM elements starting from `root`.
 */
export async function domRenderer(root: any): Promise<void> {
    const directivePrefix = prefix();

    const directiveRegex = /(?<name>[\w-]+)(?:\[(?<type>[^\]]*)])?.?(?<modifiers>(?:[\w-]+(?:\[[^\]]*])?(?:\.[\w-]+(?:\[[^\]]*])?)*)?)?/;

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

        const castedNode = node as WickedStateElementContract;

        if (castedNode.__wickedStateProcessed) {
            continue;
        }

        const bindings: WickedStateDirectiveBindingContract[] = [];

        const attributes = castedNode.attributes;

        const attributesLength = attributes.length;

        for (let i = 0; i < attributesLength; i++) {
            const attribute = attributes[i];

            if ( ! attribute.name.startsWith(directivePrefix)) {
                continue;
            }

            const attributeName = attribute.name.slice(directivePrefix.length);

            const directive = directiveRegex.exec(attributeName);

            if ( ! directive) {
                continue;
            }

            const name = directive.groups.name ?? null;

            if ( ! name) {
                continue;
            }

            const registeredDirective = directives.find((directive) => directive.name === name);

            if ( ! registeredDirective) {
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
                priority: registeredDirective.priority,
                handler: (context) => {
                    if (context.node.__wickedStateIgnore || context.node.__wickedStateIgnoreSelf) {
                        return;
                    }

                    let parent = context.node.parentElement as WickedStateElementContract;

                    while (parent) {
                        if (parent.__wickedStateIgnore) {
                            return;
                        }

                        parent = parent.parentElement;
                    }

                    return registeredDirective.handler(context);
                },
            });
        }

        console.log('bindings', JSON.stringify(bindings, null, 2));

        bindings.sort((a, b) => a.priority - b.priority);

        console.log('sorted bindings', JSON.stringify(bindings, null, 2));

        const bindingsLength = bindings.length;

        const bindingsCleanups = getCleanups(castedNode, 'bindings');

        for (let i = 0; i < bindingsLength; i++) {
            const binding = bindings[i];

            const stateRoot = getStateRoot(castedNode);

            const state = stateRoot?.__wickedStateObject;

            const stopEffect = reactivity.effect(() => {
                const cleanups = getCleanups(castedNode, binding.type);

                if (stateRoot) {
                    stateRoot.__wickedStateCurrentElement = castedNode;
                }

                while (cleanups.length) {
                    cleanups.shift()();
                }

                const cleanup = binding.handler({
                    bindings,
                    state,
                    node: castedNode,
                    root: stateRoot,
                    type: binding.type,
                    value: binding.value,
                    modifiers: binding.modifiers,
                });

                if (isFunction(cleanup)) {
                    cleanups.push(cleanup as Function);
                }
            });

            bindingsCleanups.push(stopEffect);
        }

        castedNode.__wickedStateProcessed = true;
    }

    if ( ! root.__wickedObserved) {
        const observer = new MutationObserver((mutations) => {
            const nodes = mutations.reduce((acc, mutation) => {
                acc.removed.push.apply(
                    acc.removed,
                    [].slice.call(mutation.removedNodes).filter((node: Node) => node instanceof HTMLElement),
                );

                acc.added.push.apply(
                    acc.added,
                    [].slice.call(mutation.addedNodes).filter((node: Node) => node instanceof HTMLElement),
                );

                return acc;
            }, {added: [], removed: []});

            nodes.removed.forEach((node) => {
                const element = node as WickedStateElementContract;

                const elementState = element.__wickedStateObject;

                const destroyHandler = elementState?.destroy;

                if (isFunction(destroyHandler)) {
                    destroyHandler.call(elementState);
                }

                const cleanups = element.__wickedStateCleanups;

                if (isObject(cleanups)) {
                    Object.keys(cleanups).forEach((type) => {
                        const typeCleanups = cleanups[type];

                        while (typeCleanups.length) {
                            typeCleanups.shift()();
                        }
                    });
                }

                delete element.__wickedStateObject;

                delete element.__wickedStateCurrentElement;

                delete element.__wickedStateCleanups;

                delete element.__wickedStateRefs;

                delete element.__wickedStateWhenElement;

                delete element.__wickedStateInLoop;

                delete element.__wickedStateLoopItems;

                delete element.__wickedStateIgnore;

                delete element.__wickedStateIgnoreSelf;

                delete element.__wickedStateProcessed;
            });

            if (nodes.added.length) {
                domRenderer(root);
            }
        });

        observer.observe(root, { childList: true, subtree: true });

        root.__wickedObserved = true;
    }
}
