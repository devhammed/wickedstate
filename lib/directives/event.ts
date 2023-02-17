import { Directive } from '../contracts/directive';

export function eventDirective(): Directive {
  return {
    priority: 10,
    newContext: false,
    isTemplate: false,
    apply: function ({ el, context, exp, arg: eventName, modifiers }) {
      if (typeof eventName !== 'string') {
        throw new Error(
          'Event directive requires a valid event name e.g @:click'
        );
      }

      el.addEventListener(eventName, function (e) {
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
