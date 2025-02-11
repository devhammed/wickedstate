import {WickedStateDirectiveContract} from '../../utils/contracts';

export const refDirective: WickedStateDirectiveContract = {
  name: 'ref',
  priority: 1,
  handler({ value, node, root, cleanup }) {
    if ( ! root.__wickedStateRefs) {
        root.__wickedStateRefs = {};
    }

    root.__wickedStateRefs[value] = node;

    cleanup(() => {
      delete root.__wickedStateRefs[value];
    });
  },
};
