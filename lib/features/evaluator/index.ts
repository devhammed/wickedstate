import {WickedStateEvaluatorContract} from '../../utils/contracts';

export let evaluator: WickedStateEvaluatorContract = (expr, context) => {
    const accessor = new Function(
        'context',
        `
        return (function() {
          with (context) {
            return ${expr};
          }
        })();
      `,
    );

    return accessor.call(context, context);
};

export function setEvaluator(fn: WickedStateEvaluatorContract): WickedStateEvaluatorContract {
    const previousEvaluator = evaluator;

    evaluator = fn;

    return previousEvaluator;
}
