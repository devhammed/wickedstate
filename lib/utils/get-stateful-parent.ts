import { WickedStateElementContract } from './contracts';

export function getStatefulParent(el: HTMLElement): WickedStateElementContract | null {
  let parent: HTMLElement = el.parentElement;

  while (parent) {
    if ('__wickedState' in parent) {
      return parent as WickedStateElementContract;
    }

    parent = parent.parentElement;
  }

  return null;
}
