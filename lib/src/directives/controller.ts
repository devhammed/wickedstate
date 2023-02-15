import { directive, getController, invoke } from '../core/provider';

directive('*controller', () => {
  return {
    newContext: true,
    apply: function (el, context, exp) {
      const ctrl = getController(exp);

      if (ctrl === null) {
        throw new Error(`controller "${exp}" not found`);
      }

      invoke(ctrl, { $context: context, $ctx: context, $el: el });
    },
  };
});
