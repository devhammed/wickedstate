import {evaluator} from '../evaluator';
import {reactivity} from '../reactivity';
import {decorateWithMagics} from '../magics';
import {isFunction} from '../../utils/checkers';
import {WickedStateDirectiveContract} from '../../utils/contracts';

export const stateDirective: WickedStateDirectiveContract = {
    name: 'state',
    priority: 0,
    handler({node, value}): void {
        if (node.__wickedStateDisconnect) {
            return;
        }

        const expr = value.trim() || '{}';

        node.__wickedStateObject = decorateWithMagics({
            root: node,
            state: reactivity.reactive({
                ...evaluator(expr, {}),
                ...node.__wickedStateObject ?? {},
            }),
        });

        node.__wickedStateCurrentElement = node;

        const init = node.__wickedStateObject.init ?? null;

        if (isFunction(init)) {
            init.call(node.__wickedStateObject);
        }
    },
};
