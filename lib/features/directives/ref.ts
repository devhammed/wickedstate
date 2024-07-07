import { DirectiveContract } from '../../utils/contracts';

export function refDirective({ value, node, root }: DirectiveContract<string>) {
  if ( ! root.__wickedRefs) {
    root.__wickedRefs = {};
  }

  root.__wickedRefs[value] = node;

  return () => delete root.__wickedRefs[value];
}
