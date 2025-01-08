import {evaluator} from '../evaluator';
import {WickedStateDirectiveContract} from '../../utils/contracts';

export const showDirective: WickedStateDirectiveContract = {
  name: 'show',
  priority: 2,
  handler({ value, node, state }) {
    const evaluatedValue = evaluator(value, state);

    if ( ! evaluatedValue) {
      node.style.display = 'none';

      return () => node.style.display = '';
    }

    node.style.display = '';

    return () => node.style.display = 'none';
  },
};
