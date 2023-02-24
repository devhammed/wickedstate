import { Directive } from '../contracts/directive';

export function bindDirective(): Directive {
  return {
    priority: 10,
    newContext: false,
    isTemplate: false,
    apply: function ({ el, context, exp, arg: attribute }) {
      function setAttribute(value: string | object) {
        switch (attribute) {
          case 'style':
            if (typeof value === 'object') {
              for (const key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                  (el as HTMLElement).style[key] = value[key];
                }
              }
            } else {
              el.setAttribute(attribute, value);
            }

            break;
          default:
            el[attribute] = value;
            break;
        }
      }

      setAttribute(context.$eval<string>(exp));

      context.$watch(exp, setAttribute);
    },
  };
}
