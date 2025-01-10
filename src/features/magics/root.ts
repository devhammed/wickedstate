import {
  WickedStateElementContract,
  WickedStateMagicContextContract,
} from '../../utils/contracts';

export function rootMagic({ root }: WickedStateMagicContextContract): WickedStateElementContract | null {
  return root;
}
