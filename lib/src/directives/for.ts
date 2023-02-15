import { compile } from '../core/dom';
import { Context } from '../core/context';
import { directive } from '../core/provider';

directive('*for', () => {
  return {
    newContext: false,
    apply: function (el, context, exp) {
      if (typeof exp !== 'string') {
        throw new Error('for expression must be a string');
      }

      const contexts: Context[] = [];
      const renderedElements: Element[] = [];
      const parts = exp.split('in').map((part) => part.trim());

      if (parts.length !== 2) {
        throw new Error('Invalid for expression');
      }

      const itemName = parts[0];
      const collectionName = parts[1];
      const parentNode = el.parentNode;

      function render(items: any[] | null) {
        if (Object.prototype.toString.call(items) !== '[object Array]') {
          return;
        }

        contexts.forEach((s) => s.$destroy());

        renderedElements.forEach((el) => el.parentNode.removeChild(el));

        contexts.length = 0;

        renderedElements.length = 0;

        items.forEach(function (item: any, index: number) {
          const ctx = context.$new() as Context & { $i: number };
          const currentNode = el.cloneNode(true) as Element;

          currentNode.removeAttribute('*for');

          contexts.push(ctx);

          ctx[itemName] = item;

          ctx.$i = index;

          compile(currentNode, ctx);

          parentNode.appendChild(currentNode);

          renderedElements.push(currentNode);
        });
      }

      parentNode.removeChild(el);

      context.$watch(collectionName, render);

      render(context.$eval(collectionName));
    },
  };
});
