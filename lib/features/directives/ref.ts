import {WickedStateDirectiveContract} from '../../utils/contracts';

export const refDirective: WickedStateDirectiveContract = {
  name: 'ref',
  priority: 1,
  handler({ value, node, root }) {
    root.__wickedStateRefs[value] = node;

    return () => delete root.__wickedStateRefs[value];
  },
};
