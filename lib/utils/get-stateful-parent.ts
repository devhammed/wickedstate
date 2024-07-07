import { WickedStateElementContract } from './contracts';

export function getStatefulParent(el: WickedStateElementContract): WickedStateElementContract | null {
  let parent: HTMLElement = el.parentElement;

  while (parent) {
    if ('__wickedStateObject' in parent) {
      return parent as WickedStateElementContract;
    }

    parent = parent.parentElement;
  }

  return null;
}
