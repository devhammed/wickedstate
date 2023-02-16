import { Directive } from '../contracts/directive';

export function refDirective(): Directive {
  return {
    newContext: false,
    isTemplate: false,
    apply({ el, context, exp }) {
      context.$refs[exp] = el;
    },
  };
}
