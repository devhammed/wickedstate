import { MagicContextContract } from '../../utils/contracts';

export function rootMagic({ root }: MagicContextContract): HTMLElement | null {
  return root;
}
