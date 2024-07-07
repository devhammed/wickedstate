import { WickedStateMagicContextContract } from '../../utils/contracts';

export function dataMagic({ root }: WickedStateMagicContextContract): Object {
  return root.__wickedStateObject;
}
