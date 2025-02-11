import { evaluator } from '../evaluator';
import { WickedStateDirectiveContract } from '../../utils/contracts';

export const textDirective: WickedStateDirectiveContract = {
  name: 'text',
  priority: 2,
  handler({ node, value, state, effect, cleanup }): void {
    const stopEffect = effect(() => {
      node.textContent = evaluator(value, state);
    });

    cleanup(stopEffect);
  },
};
