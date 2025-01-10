import {evaluator} from '../evaluator';
import { WickedStateDirectiveContract } from '../../utils/contracts';

export const textDirective: WickedStateDirectiveContract = {
  name: 'text',
  priority: 2,
  handler({ node, value, state }): void {
    node.textContent = evaluator(value, state);
  },
};
