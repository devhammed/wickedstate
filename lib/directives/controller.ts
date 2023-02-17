import { Directive } from '../contracts/directive';

export function controllerDirective(): Directive {
  return {
    priority: 10,
    newContext: true,
    isTemplate: false,
    apply: function ({ el, context, exp }) {
      const ctrl = context.$app.getController(exp);

      if (ctrl === null) {
        throw new Error(`controller "${exp}" not found`);
      }

      context.$app.invoke(ctrl, { $context: context, $ctx: context, $el: el });

      return true;
    },
  };
}
