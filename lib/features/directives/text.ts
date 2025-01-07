import { WickedStateDirectiveContract } from '../../utils/contracts';

export const textDirective: WickedStateDirectiveContract<string> = {
  name: 'text',
  priority: 2,
  handler({ node, value }): void {
    node.textContent = value;
  },
};
