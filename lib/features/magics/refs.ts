import { MagicContextContract } from '../../utils/contracts';

export function refsMagic({ root }: MagicContextContract): Record<string, HTMLElement> {
  return root.__wickedRefs ?? {};
}
