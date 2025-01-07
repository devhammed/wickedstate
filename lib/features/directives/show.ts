import {WickedStateDirectiveContract} from '../../utils/contracts';

export const showDirective: WickedStateDirectiveContract<boolean> = {
  name: 'show',
  priority: 2,
  handler({ value, node }) {
    if ( ! value) {
      node.style.display = 'none';

      return () => node.style.display = '';
    }

    node.style.display = '';

    return () => node.style.display = 'none';
  },
};
