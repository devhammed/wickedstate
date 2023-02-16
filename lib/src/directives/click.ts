import { Directive } from '../contracts/directive';

export function clickDirective(): Directive {
  return {
    newContext: false,
    isTemplate: false,
    apply: function ({ el, context, exp }) {
      el.addEventListener('click', function (e) {
        try {
          context.$eval(exp, { $event: e });
          context.$notify();
        } catch {}
      });
    },
  };
}
