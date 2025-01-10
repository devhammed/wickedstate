import {WickedStateEvaluatorContract} from '../../utils/contracts';

/**
 * Evaluate an expression in the context of the state and locals using the function constructor.
 *
 * @example
 * ```ts
 * import { functionEvaluator } from 'wickedstate';
 *
 * functionEvaluator('a + b', { a: 1 }, { b: 2 }); // 3
 * ```
 */
export const functionEvaluator: WickedStateEvaluatorContract = (expr, state, locals = {}) => {
    const accessor = new Function(
        'locals',
        `
           return (function() {
              with (this) {
                 with (locals) {
                    return ${expr};
                 }
              }
           }).call(this);
      `,
    );

    return accessor.call(state, locals);
};
