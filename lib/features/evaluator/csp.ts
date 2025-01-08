import {WickedStateEvaluatorContract} from '../../utils/contracts';

export const cspEvaluator: WickedStateEvaluatorContract = (expr, state, locals = {}) => {
    return expr.split('.').reduce((acc, key) => {
        return acc[key];
    }, { ...state, ...locals });
};
