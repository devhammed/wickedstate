import {
    WickedStateDirectiveContract,
    WickedStateElementContract
} from '../../utils/contracts';
import {evaluator} from '../evaluator';
import {count, isArray } from '../../utils/checkers';

export const eachDirective: WickedStateDirectiveContract = {
    name: 'each',
    priority: 1,
    handler({ node, state, value, bindings }): () => void {
        const evaluated = evaluator(value, state) as any[];

        if ( ! isArray(evaluated)) {
            throw new Error(
                '[WickedState] Each directive requires an array of items.',
            );
        }

        if (count(bindings) > 1) {
            throw new Error(
                '[WickedState] You cannot use other directives with the when directive.',
            );
        }

        if ( ! (node instanceof HTMLTemplateElement)) {
            throw new Error(
                '[WickedState] When directive can only be used on <template> elements.',
            );
        }

        const template = node as WickedStateElementContract & HTMLTemplateElement;
        const elements = <WickedStateElementContract[]>[];

        evaluated.forEach((item: any, index: number) => {
            const clone = template.content.cloneNode(true) as DocumentFragment;

            const firstElementChild = clone.firstElementChild as WickedStateElementContract;

            if (!firstElementChild) {
                throw new Error(
                    '[WickedState] Each directive requires a child element.',
                );
            }

            firstElementChild.__wickedStateLoop = {
                index,
                item,
                iteration: index + 1,
                even: (index + 1) % 2 === 0,
                odd: (index + 1) % 2 !== 0,
                first: index === 0,
                last: index === value.length - 1,
            };

            if (index >= elements.length) {
                template.before(clone);
            } else {
                elements[index].before(clone);
            }

            elements.push(firstElementChild);
        });

        return () => {
            elements.forEach((element: WickedStateElementContract) => {
                element.remove();
            });
        };
    },
};
