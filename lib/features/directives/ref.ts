import {WickedStateDirectiveContract} from '../../utils/contracts';

export const refDirective: WickedStateDirectiveContract<string> = {
  name: 'ref',
  priority: 1,
  handler({ value, node, root }) {
    if ( ! root.__wickedStateRefs) {
      root.__wickedStateRefs = {};
    }

    root.__wickedStateRefs[value] = node;

    return () => delete root.__wickedStateRefs[value];
  },
};
