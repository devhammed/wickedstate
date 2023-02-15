import { directive } from '../core/provider';

directive('*bind', () => {
  return {
    newContext: false,
    isTemplate: false,
    apply: function (el, context, exp) {
      el.textContent = context.$eval<string>(exp);

      context.$watch<string>(exp, function (val) {
        el.textContent = val;
      });
    },
  };
});
