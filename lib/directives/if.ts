import { Context } from '../core/context';
import { Directive } from '../contracts/directive';
import { Compiler } from '../contracts/compiler';

type Marker = Comment & {
  $$currentIfElement: IfElement | null;
};

type IfElement = Element & {
  $$context: Context | null;
};

export function ifDirective(): Directive {
  return {
    priority: 999,
    isTemplate: true,
    newContext: false,
    apply({ el, context, exp }) {
      const compile = context.$app.get<Compiler>('$compile');
      const marker = document.createComment(` wickedIf: ${exp} `) as Marker;
      const endMarker = document.createComment(
        ` wickedEndIf: ${exp} `
      ) as Marker;
      const show = () => {
        if (!marker.$$currentIfElement && !endMarker.$$currentIfElement) {
          const clone = el.cloneNode(true) as IfElement;

          clone.removeAttribute('*if');

          clone.$$context = context.$new();

          marker.$$currentIfElement = clone;

          endMarker.$$currentIfElement = clone;

          marker.parentNode.insertBefore(clone, endMarker);

          compile(clone, clone.$$context);
        }
      };
      const hide = () => {
        if (
          marker.$$currentIfElement &&
          endMarker.$$currentIfElement &&
          marker.$$currentIfElement === endMarker.$$currentIfElement &&
          marker.$$currentIfElement.$$context ===
            endMarker.$$currentIfElement.$$context
        ) {
          marker.$$currentIfElement.$$context.$destroy();
          endMarker.$$currentIfElement.$$context = null;
          marker.parentNode.removeChild(endMarker.$$currentIfElement);
          marker.$$currentIfElement = null;
          endMarker.$$currentIfElement = null;
        }
      };

      el.parentNode.replaceChild(marker, el);

      marker.parentNode.insertBefore(endMarker, marker.nextSibling);

      if (context.$eval<boolean>(exp)) {
        show();
      } else {
        hide();
      }

      context.$watch<boolean>(exp, (value) => {
        if (value) {
          show();
        } else {
          hide();
        }
      });

      return false;
    },
  };
}
