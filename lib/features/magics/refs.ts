import {WickedStateElementContract, WickedStateMagicContextContract} from '../../utils/contracts';

export function refsMagic({ root }: WickedStateMagicContextContract): Record<string, WickedStateElementContract> {
  return root.__wickedStateRefs ?? {};
}
