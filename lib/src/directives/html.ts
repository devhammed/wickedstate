import { Directive } from '../contracts/directive';

export function htmlDirective(): Directive {
  return {
    priority: 10,
    newContext: false,
    isTemplate: false,
    apply: function ({ el, context, exp }) {
      el.innerHTML = context.$eval<string>(exp);

      context.$watch<string>(exp, function (val) {
        el.innerHTML = val;
      });

      return true;
    },
  };
}
