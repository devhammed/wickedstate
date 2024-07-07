import { WickedStateMagicContextContract } from '../../utils/contracts';

export function refsMagic({ root }: WickedStateMagicContextContract): Record<string, HTMLElement> {
  return root.__wickedStateRefs ?? {};
}
