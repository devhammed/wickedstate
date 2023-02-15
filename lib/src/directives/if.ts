import { compile } from '../core/dom';
import { directive } from '../core/provider';

directive('*if', () => ({
  newContext: false,
  apply(el, context, exp) {
    if (typeof exp !== 'string') {
      throw new Error('if expression must be a string');
    }

    const clone = el.cloneNode(true) as Element;
    const marker = document.createComment(`*if: ${exp}`);
    const show = () => {
      if (!marker.parentNode.contains(clone)) {
        marker.parentNode.insertBefore(clone, marker.nextSibling);
        compile(clone, context);
      }
    };
    const hide = () => {
      if (marker.parentNode.contains(clone)) {
        marker.parentNode.removeChild(clone);
      }
    };

    el.parentNode.replaceChild(marker, el);

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
