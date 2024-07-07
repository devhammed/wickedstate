import {
  WickedStateMagicContextContract,
  WickedStateObjectContract,
} from '../../utils/contracts';

export function parentMagic({ root }: WickedStateMagicContextContract): WickedStateObjectContract | null {
  return root.__wickedStateParent?.__wickedStateObject;
}
