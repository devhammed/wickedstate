import { compile } from '../core/dom';
import { Context } from '../core/context';
import { directive } from '../core/provider';

type Marker = Comment & {
  $$currentIfElement: IfElement | null;
};

type IfElement = Element & {
  $$context: Context | null;
};

directive('*if', () => {
  return {
    newContext: false,
    isTemplate: true,
    apply(el, context, exp) {
      const marker = document.createComment(` if: ${exp} `) as Marker;
      const endMarker = document.createComment(` endif: ${exp} `) as Marker;
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
          console.log(marker.$$currentIfElement.$$context);
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
});
