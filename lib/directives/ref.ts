import { Directive } from '../contracts/directive';

export function refDirective(): Directive {
  return {
    priority: 10,
    newContext: false,
    isTemplate: false,
    apply({ el, context, exp }) {
      context.$refs[exp] = el;
    },
  };
}
