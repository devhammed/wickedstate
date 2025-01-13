import { WickedStateDirectiveContract } from '../../utils/contracts';

export const cloakDirective: WickedStateDirectiveContract = {
  name: 'cloak',
  priority: -1,
  handler({ node }): void {
    node.removeAttribute('*cloak');
  },
};
