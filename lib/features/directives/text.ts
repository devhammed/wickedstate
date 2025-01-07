import { WickedStateDirectiveContract } from '../../utils/contracts';

export const textDirective: WickedStateDirectiveContract = {
  name: 'text',
  priority: 2,
  handler({ node, value }): void {
    node.textContent = value;
  },
};
