import {
  WickedStateLoopContract,
  WickedStateMagicContextContract,
  WickedStateObjectContract,
} from '../../utils/contracts';

export function loopMagic<T>({ root }: WickedStateMagicContextContract): WickedStateLoopContract<T> {
  return root.__wickedStateLoop;
}
