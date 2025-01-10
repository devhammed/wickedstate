import {functionEvaluator} from './function';
import {WickedStateEvaluatorContract} from '../../utils/contracts';

/**
 * The expression evaluator used by WickedState.
 *
 * @example
 * ```ts
 * import { evaluator } from 'wickedstate';
 *
 * const result = evaluator('foo.bar', { foo: { bar: 'baz' } });
 *
 * console.log(result); // baz
 * ```
 */
export let evaluator: WickedStateEvaluatorContract = functionEvaluator;

/**
 * Switch the expression evaluator.
 *
 * @example
 * ```ts
 * import { setEvaluator } from 'wickedstate';
 *
 * setEvaluator((expr, state, locals) => {
 *  // Custom evaluator
 * });
 * ```
 */
export function setEvaluator(newEvaluator: WickedStateEvaluatorContract): WickedStateEvaluatorContract {
    const previousEvaluator = evaluator;

    evaluator = newEvaluator;

    return previousEvaluator;
}
