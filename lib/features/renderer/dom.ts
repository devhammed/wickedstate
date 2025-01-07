import {getStateRoot} from '../../utils/dom';
import {WickedStateDirectiveBindingContract} from '../../utils/contracts';

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

        const stateRoot = getStateRoot(node);

        const attributes = node.attributes;

        for (let i = 0; i < attributes.length; i++) {
            const attribute = attributes[i];

            const directive = directiveRegex.exec(attribute.name);

            if (!directive) {
                continue;
            }

            const name = directive.groups.name ?? null;

            if (!name) {
                continue;
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
            });
        }

        console.log(bindings);

        // Process the node
    }
}
