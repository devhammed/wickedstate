import { WickedStateMagicContextContract } from '../../utils/contracts';

export function parentMagic({ root }: WickedStateMagicContextContract): Object | null {
  return root.__wickedStateParent?.__wickedStateObject;
}
