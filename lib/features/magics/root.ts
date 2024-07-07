import { WickedStateMagicContextContract } from '../../utils/contracts';

export function rootMagic({ root }: WickedStateMagicContextContract): HTMLElement | null {
  return root;
}
