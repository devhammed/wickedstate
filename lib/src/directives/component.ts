import { Context } from '../core/context';
import { Directive } from '../contracts/directive';

type ComponentMarker = Comment & {
  $$templateRoot: Element | null;
};

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

      const compile =
        context.$app.get<(el: Element, context: Context) => void>('$compile');
      const componentContext = context.$new();
      const marker = document.createComment(
        ` wickedComponent: ${exp} `
      ) as ComponentMarker;
      const endMarker = document.createComment(
        ` wickedEndComponent: ${exp} `
      ) as ComponentMarker;

      function render() {
        if (
          marker.$$templateRoot &&
          endMarker.$$templateRoot &&
          marker.$$templateRoot === endMarker.$$templateRoot
        ) {
          marker.parentNode.removeChild(endMarker.$$templateRoot);
        }

        const container = document.createElement('div');

        container.innerHTML = component.template;

        const templateRoot = container.children[0];

        if (templateRoot === null) {
          throw new Error(`template for component "${exp}" not found`);
        }

        component.props.forEach(({ as, name }) => {
          const value = componentContext.$parent.$eval(
            el.attributes[`$${name}`]?.value ?? undefined
          );

          componentContext[name] = typeof as === 'function' ? as(value) : value;
        });

        const ref = el.attributes['#ref'];

        if (ref) {
          componentContext.$parent.$refs[ref.value] = templateRoot;
        }

        marker.$$templateRoot = templateRoot;

        endMarker.$$templateRoot = templateRoot;

        marker.parentNode.insertBefore(templateRoot, endMarker);

        compile(templateRoot, componentContext);
      }

      el.parentNode.replaceChild(marker, el);

      marker.parentNode.insertBefore(endMarker, marker.nextSibling);

      render();

      component.props.forEach(({ name }) => {
        componentContext.$parent.$watch(name, render);
      });
    },
  };
}
