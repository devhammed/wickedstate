import {
  WickedStateElementContract,
  WickedStateMagicContextContract,
  WickedStateObjectContract,
} from '../../utils/contracts';

export function parentMagic({ root }: WickedStateMagicContextContract): WickedStateObjectContract | null {
  let parent: HTMLElement = root.parentElement;

  while (parent) {
    if ('__wickedStateObject' in parent) {
        return (parent as WickedStateElementContract).__wickedStateObject;
    }

    parent = parent.parentElement;
  }

  return null;
}
