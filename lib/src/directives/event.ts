import { Directive } from '../contracts/directive';

export function makeEventDirective(eventName: string): () => Directive {
  return (): Directive => {
    return {
      priority: 10,
      newContext: false,
      isTemplate: false,
      apply: function ({ el, context, exp }) {
        el.addEventListener(eventName, function (e) {
          try {
            context.$eval(exp, { $event: e });
            context.$notify();
          } catch {}
        });
      },
    };
  };
}
