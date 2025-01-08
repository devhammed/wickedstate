import {evaluator} from '../evaluator';
import {reactivity} from '../reactivity';
import {decorateWithMagics} from '../magics';
import {isFunction} from '../../utils/checkers';
import {WickedStateDirectiveContract} from '../../utils/contracts';
import {decorateWithDataProviders} from "../datas";

export const stateDirective: WickedStateDirectiveContract = {
    name: 'state',
    priority: 0,
    handler({node, value}): void {
        if (node.__wickedStateDisconnect) {
            return;
        }

        node.__wickedStateCurrentElement = node;

        const expression = value.trim() || '{}';

        const magicContext = decorateWithMagics({}, node);

        const dataContext = decorateWithDataProviders({}, magicContext);

        const state = evaluator(expression, dataContext);

        const reactiveState =  reactivity.reactive({
            ...state,
            ...node.__wickedStateObject ?? {},
        });

        node.__wickedStateObject = decorateWithMagics(reactiveState, node);

        const init = node.__wickedStateObject.init ?? null;

        if (isFunction(init)) {
            init.call(node.__wickedStateObject);
        }
    },
};
