import {evaluator} from '../evaluator';
import {reactivity} from '../reactivity';
import {decorateWithMagics} from '../magics';
import {isFunction} from '../../utils/checkers';
import {WickedStateDirectiveContract} from '../../utils/contracts';
import {decorateWithDatas} from "../datas";

export const stateDirective: WickedStateDirectiveContract = {
    name: 'state',
    priority: 0,
    handler({node, value, cleanup}): void {
        const expression = value === '' ? '{}' : value;

        const magicContext = decorateWithMagics({}, (node.__wickedStateCurrentElement = node));

        const dataContext = decorateWithDatas({}, magicContext);

        const state = evaluator(expression, magicContext, dataContext);

        const reactiveState =  reactivity.reactive({
            ...state,
            ...node.__wickedStateObject ?? {},
        });

        node.__wickedStateObject = decorateWithMagics(reactiveState, node);

        const init = node.__wickedStateObject.init ?? null;

        if (isFunction(init)) {
            init.call(node.__wickedStateObject);
        }

        cleanup(() => {
            const destroy = node.__wickedStateObject?.destroy ?? null;

            if (isFunction(destroy)) {
                destroy.call(node.__wickedStateObject);
            }

            delete node.__wickedStateObject;

            delete node.__wickedStateCurrentElement;
        });
    },
};
