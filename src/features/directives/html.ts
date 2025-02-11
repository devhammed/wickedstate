import {evaluator} from '../evaluator';
import {WickedStateDirectiveContract} from '../../utils/contracts';

export const htmlDirective: WickedStateDirectiveContract = {
  name: 'html',
  priority: 2,
  handler({ node, value, state, effect, cleanup }): void {
    const stopEffect = effect(() => {
      node.innerHTML = evaluator(value, state);
    });

    cleanup(stopEffect);
  },
};
