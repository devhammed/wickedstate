import { directive } from '../core/provider';

directive('*text', () => {
  return {
    newContext: false,
    apply: function (el, context, exp) {
      el.textContent = context.$eval<string>(exp);

      context.$watch<string>(exp, function (val) {
        el.textContent = val;
      });
    },
  };
});
