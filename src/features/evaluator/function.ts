import {WickedStateEvaluatorContract} from '../../utils/contracts';

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
