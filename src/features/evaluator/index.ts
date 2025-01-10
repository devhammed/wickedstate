import {functionEvaluator} from './function';
import {WickedStateEvaluatorContract} from '../../utils/contracts';

export let evaluator: WickedStateEvaluatorContract = functionEvaluator;

export function setEvaluator(newEvaluator: WickedStateEvaluatorContract): WickedStateEvaluatorContract {
    const previousEvaluator = evaluator;

    evaluator = newEvaluator;

    return previousEvaluator;
}
