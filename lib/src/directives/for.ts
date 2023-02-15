import { compile } from '../core/dom';
import { Context } from '../core/context';
import { directive } from '../core/provider';

directive('*for', () => {
  return {
    newContext: false,
    apply: function (el, context, exp) {
      let contexts: Context[] = [];
      let parts = ((typeof exp === 'function' ? exp() : exp) as string).split(
        'in'
      );

      if (parts.length !== 2) {
        throw new Error('Invalid for expression');
      }

      let itemName = parts[0].trim();
      let collectionName = parts[1].trim();
      let parentNode = el.parentNode;

      function render(val: any[] | null) {
        while (parentNode?.firstChild) {
          parentNode?.removeChild(parentNode?.firstChild);
        }

        contexts.forEach((s) => s.$destroy());

        contexts = [];

        val?.forEach(function (val: any, index: number) {
          let ctx = context.$new() as Context & { $i: number };
          let currentNode = el.cloneNode(true) as Element;

          currentNode.removeAttribute('*for');

          contexts.push(ctx);

          ctx[itemName] = val;

          ctx.$i = index;

          compile(currentNode, ctx);

          parentNode?.appendChild(currentNode);
        });
      }

      context.$watch(collectionName, render);

      render(context.$eval(collectionName));
    },
  };
});
