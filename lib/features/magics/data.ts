import { MagicContextContract } from '../../utils/contracts';

export function dataMagic({ root }: MagicContextContract): Object {
  return root.__wickedState;
}
