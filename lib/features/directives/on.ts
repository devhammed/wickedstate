import {WickedStateDirectiveContract} from '../../utils/contracts';

export const onDirective: WickedStateDirectiveContract = {
  name: 'on',
  priority: 2,
  handler({ node, value, state, type }): void {
    console.log('onDirective', { node, value, state, type });
  },
};
