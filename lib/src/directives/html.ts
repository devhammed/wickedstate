import { directive } from '../core/provider';

directive('*html', () => {
  return {
    newContext: false,
    isTemplate: false,
    apply: function (el, context, exp) {
      el.innerHTML = context.$eval<string>(exp);

      context.$watch<string>(exp, function (val) {
        el.innerHTML = val;
      });

      return true;
    },
  };
});
