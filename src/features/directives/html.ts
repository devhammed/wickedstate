import {evaluator} from '../evaluator';
import {WickedStateDirectiveContract} from '../../utils/contracts';

export const htmlDirective: WickedStateDirectiveContract = {
  name: 'html',
  priority: 2,
  handler({ node, value, state }): void {
    node.innerHTML = evaluator(value, state);
  },
};
