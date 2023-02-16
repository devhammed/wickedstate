import { Context } from '../core/context';
import { Directive } from '../contracts/directive';

export function componentDirective(): Directive {
  return {
    priority: 9999,
    isTemplate: true,
    newContext: false,
    apply({ el, exp, context }) {
      const component = context.$app.getComponent(exp);

      if (component === null) {
        throw new Error(`component "${exp}" not found`);
      }

      const container = document.createElement('div');

      container.innerHTML = component.template;

      const templateRoot = container.children[0];

      if (templateRoot === null) {
        throw new Error(`template for component "${exp}" not found`);
      }

      const compile =
        context.$app.get<(el: Element, context: Context) => void>('$compile');
      const componentContext = context.$new();
      const marker = document.createComment(` wickedComponent: ${exp} `);
      const endMarker = document.createComment(` wickedEndComponent: ${exp} `);
      const ref = el.attributes['#ref'];

      if (ref) {
        componentContext.$parent.$refs[ref.value] = templateRoot;
      }

      function render(isFirstTime) {
        component.props.forEach(({ as, name, isRequired }) => {
          const exprValue = el.attributes[`$${name}`]?.value;

          if (isRequired && typeof exprValue !== 'string') {
            throw new Error(
              `required attribute "${name}" for "${exp}" component not found`
            );
          }

          const value = componentContext.$parent.$eval(exprValue);

          componentContext[name] = typeof as === 'function' ? as(value) : value;
        });

        if (isFirstTime) {
          compile(templateRoot, componentContext);
        }
      }

      el.parentNode.replaceChild(marker, el);

      marker.parentNode.insertBefore(endMarker, marker.nextSibling);

      marker.parentNode.insertBefore(templateRoot, endMarker);

      render(true);

      component.props.forEach(({ name }) => {
        const exprValue = el.attributes[`$${name}`]?.value;

        if (typeof exprValue !== 'string') {
          return;
        }

        componentContext.$parent.$watch(exprValue, () => {
          render(false);
        });
      });
    },
  };
}
