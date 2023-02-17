import { Directive } from '../contracts/directive';

export function eventDirective(): Directive {
  return {
    priority: 10,
    newContext: false,
    isTemplate: false,
    apply: function ({ el, context, exp, arg, modifiers }) {
      if (typeof arg !== 'string') {
        throw new Error(
          'Event directive requires a valid event name e.g @:click'
        );
      }

      el.addEventListener(arg, function (e) {
        if (modifiers.prevent) {
          e.preventDefault();
        }

        if (modifiers.stop) {
          e.stopPropagation();
        }

        if (modifiers.stopImmediate) {
          e.stopImmediatePropagation();
        }

        try {
          context.$eval(exp, { $event: e });
          context.$notify();
        } catch {}
      });
    },
  };
}
