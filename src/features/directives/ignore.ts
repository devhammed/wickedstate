import {WickedStateDirectiveContract} from '../../utils/contracts';

export const ignoreDirective: WickedStateDirectiveContract = {
  name: 'ignore',
  priority: -2,
  handler({ node, modifiers }): () => void {
    if (modifiers.self) {
      node.__wickedStateIgnoreSelf = true;
    } else {
      node.__wickedStateIgnore = true;
    }

    return () => {
        if (modifiers.self) {
            delete node.__wickedStateIgnoreSelf;
        } else {
            delete node.__wickedStateIgnore;
        }
    };
  },
};
