import {prefix} from './index';
import {reactivity} from '../reactivity';
import {directives} from '../directives';
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
 * Check to should ignore the element.
 */
function shouldIgnoreElement(element: WickedStateElementContract): boolean {
    if (element.__wickedStateIgnore || element.__wickedStateIgnoreSelf) {
        return true;
    }

    let parent = element.parentElement as WickedStateElementContract;

    while (parent) {
        if (parent.__wickedStateIgnore) {
            return true;
        }

        parent = parent.parentElement;
    }

    return !!element.__wickedStateProcessed;
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

        if ( ! (node instanceof HTMLElement)) {
            continue;
        }

        const castedNode = node as WickedStateElementContract;

        if (shouldIgnoreElement(castedNode)) {
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
                console.warn(`Directive "${name}" is not registered.`);
                continue;
            }

            const type = directive.groups.type ?? name;

            const modifiers = (directive.groups.modifiers ?? '').split('.').reduce((acc, modifier) => {
                const match = modifiersRegex.exec(modifier);

                if ( ! match) {
                    return acc;
                }

                const name = match.groups.name ?? null;

                if ( ! name) {
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
                handler: registeredDirective.handler,
            });
        }

        bindings.sort((a, b) => a.priority - b.priority);

        const bindingsLength = bindings.length;

        for (let i = 0; i < bindingsLength; i++) {
            const binding = bindings[i];

            const stateRoot = getStateRoot(castedNode);

            const state = stateRoot?.__wickedStateObject;

            if (stateRoot) {
                stateRoot.__wickedStateCurrentElement = castedNode;
            }

            binding.handler({
                bindings,
                state,
                node: castedNode,
                root: stateRoot,
                type: binding.type,
                value: binding.value,
                modifiers: binding.modifiers,
                effect: reactivity.effect,
                cleanup: (fn) => {
                    if ( ! castedNode.__wickedStateCleanups) {
                        castedNode.__wickedStateCleanups = [];
                    }

                    castedNode.__wickedStateCleanups.push(fn);
                },
            });
        }

        castedNode.__wickedStateProcessed = true;
    }

    if ( ! root.__wickedObserved) {
        const observer = new MutationObserver((mutations) => {
            const nodes = mutations.reduce((acc, mutation) => {
                acc.removed.push.apply(
                    acc.removed,
                    [].slice.call(mutation.removedNodes),
                );

                acc.added.push.apply(
                    acc.added,
                    [].slice.call(mutation.addedNodes),
                );

                return acc;
            }, {added: [], removed: []});

            nodes.removed.forEach((node) => {
                const element = node as WickedStateElementContract;

                const cleanups = element.__wickedStateCleanups ?? [];

                while (cleanups.length) {
                   cleanups.shift()();
                }

                delete element.__wickedStateCleanups;

                delete element.__wickedStateProcessed;
            });

            if (nodes.added.length) {
                domRenderer(root);
            }
        });

        observer.observe(root, { attributes: true, childList: true, subtree: true });

        root.__wickedObserved = true;
    }
}
