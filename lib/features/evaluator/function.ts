import {WickedStateEvaluatorContract} from "../../utils/contracts";

export const functionEvaluator: WickedStateEvaluatorContract = (expr, context) => {
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
