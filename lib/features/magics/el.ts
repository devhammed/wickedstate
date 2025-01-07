import {
  WickedStateElementContract,
  WickedStateMagicContextContract,
} from '../../utils/contracts';

export function elMagic({ root }: WickedStateMagicContextContract): WickedStateElementContract {
  return root.__wickedStateCurrentElement;
}
