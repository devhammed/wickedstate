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

        const hydrate = () => domRenderer(node);

        const bindingsLength = bindings.length;

        for (let i = 0; i < bindingsLength; i++) {
            const binding = bindings[i];

            const root = getStateRoot(node);

            const state = root?.__wickedStateObject;

            const unsubscribeFromEffect = reactivity.effect(() => {
                if (root) {
                    root.__wickedStateCurrentElement = node;
                }

                reactivity.dispose(node);

                const cleanup = binding.handler({
                    bindings,
                    state,
                    node,
                    root,
                    hydrate,
                    type: binding.type,
                    value: binding.value,
                    modifiers: binding.modifiers,
                });

                if (isFunction(cleanup)) {
                    reactivity.cleanup(node, cleanup as Function);
                }
            });

            const observer = new MutationObserver(() => {
                if (!node.isConnected) {
                    observer.disconnect();

                    unsubscribeFromEffect();
                }
            });

            observer.observe(document, { childList: true, subtree: true });
        }
    }
}
