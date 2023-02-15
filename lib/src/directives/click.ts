import { directive } from '../core/provider';

directive('@click', () => {
  return {
    newContext: false,
    isTemplate: false,
    apply: function (el, context, exp) {
      el.addEventListener('click', function (e) {
        try {
          context.$eval(exp, { $event: e });
          context.$notify();
        } catch {}
      });
    },
  };
});
