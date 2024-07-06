import { MagicContextContract } from '../../utils/contracts';

export function parentMagic({ root }: MagicContextContract): Object | null {
  return root.__wickedStateParent?.__wickedState;
}
