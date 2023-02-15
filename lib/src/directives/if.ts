import { compile } from '../core/dom';
import { directive } from '../core/provider';

type Marker = Comment & {
  $$currentIfElement: Element | null;
};

directive('*if', () => ({
  newContext: false,
  apply(el, context, exp) {
    if (typeof exp !== 'string') {
      throw new Error('if expression must be a string');
    }

    const marker = document.createComment(` if: ${exp} `) as Marker;
    const endMarker = document.createComment(` endif: ${exp} `) as Marker;
    const show = () => {
      if (!marker.$$currentIfElement && !endMarker.$$currentIfElement) {
        const clone = el.cloneNode(true) as Element;

        clone.removeAttribute('*if');

        marker.$$currentIfElement = clone;

        endMarker.$$currentIfElement = clone;

        marker.parentNode.insertBefore(clone, endMarker);

        compile(clone, context);
      }
    };
    const hide = () => {
      if (
        marker.$$currentIfElement &&
        endMarker.$$currentIfElement &&
        marker.$$currentIfElement === endMarker.$$currentIfElement
      ) {
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
  },
}));
