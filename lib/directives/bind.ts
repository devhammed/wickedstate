import { Directive } from '../contracts/directive';

export function bindDirective(): Directive {
  return {
    priority: 10,
    newContext: false,
    isTemplate: false,
    apply: function ({ el, context, exp, arg: attribute }) {
      el[attribute] = context.$eval<string>(exp);

      context.$watch<string>(exp, function (val) {
        el[attribute] = val;
      });
    },
  };
}
