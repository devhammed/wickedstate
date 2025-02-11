import { evaluator } from '../evaluator';
import { WickedStateDirectiveContract } from '../../utils/contracts';

export const showDirective: WickedStateDirectiveContract = {
  name: 'show',
  priority: 2,
  handler({ value, node, state, effect, cleanup }) {
    const stopEffect = effect(() => {
       const evaluatedValue = evaluator(value, state);

       if (evaluatedValue) {
         node.style.display = '';
       } else {
         node.style.display = 'none';
       }

       if (node.style.length === 0) {
          node.removeAttribute('style');
       }
    });

    cleanup(stopEffect);
  },
};
