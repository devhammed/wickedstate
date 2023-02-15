import { directive, getController, invoke } from '../core/provider';

directive('*controller', () => {
  return {
    newContext: true,
    apply: function (el, context, exp) {
      if (typeof exp !== 'string') {
        return;
      }

      const ctrl = getController(exp);

      if (ctrl === null) {
        return;
      }

      invoke(ctrl, { $context: context, $ctx: context, $el: el });
    },
  };
});
