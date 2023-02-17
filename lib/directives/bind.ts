import { Directive } from '../contracts/directive';

export function bindDirective(): Directive {
  return {
    priority: 10,
    newContext: false,
    isTemplate: false,
    apply: function ({ el, context, exp }) {
      el.textContent = context.$eval<string>(exp);

      context.$watch<string>(exp, function (val) {
        el.textContent = val;
      });
    },
  };
}
