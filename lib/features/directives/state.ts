import {evaluator} from '../evaluator';
import {decorateWithMagics} from '../magics';
import {isFunction} from '../../utils/checkers';
import {WickedStateDirectiveContract} from '../../utils/contracts';
import {reactivity} from "../reactivity";

export const stateDirective: WickedStateDirectiveContract = {
    name: 'state',
    priority: 0,
    handler({node, value}): void {
        if (node.__wickedStateObject) {
            return;
        }

        const expr = value.trim() || '{}';

        const state = evaluator(expr, {});

        node.__wickedStateObject = decorateWithMagics({
            root: node,
            state: reactivity.reactive(state),
        });

        const init = node.__wickedStateObject.init ?? null;

        if (isFunction(init)) {
            init.call(node.__wickedStateObject);
        }
    },
};
