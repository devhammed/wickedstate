import {evaluator} from '../evaluator';
import {decorateWithMagics} from '../magics';
import {isFunction} from '../../utils/checkers';
import {WickedStateDirectiveContract} from '../../utils/contracts';
import {reactivity} from "../reactivity";

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

        const init = node.__wickedStateObject.init ?? null;

        if (isFunction(init)) {
            init.call(node.__wickedStateObject);
        }
    },
};
