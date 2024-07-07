import { WickedStateDirectiveContract } from '../../utils/contracts';

export function refDirective({ value, node, root }: WickedStateDirectiveContract<string>) {
  if ( ! root.__wickedStateRefs) {
    root.__wickedStateRefs = {};
  }

  root.__wickedStateRefs[value] = node;

  return () => delete root.__wickedStateRefs[value];
}
