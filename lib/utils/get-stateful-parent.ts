import { WickedStateRootContract } from './contracts';

export function getStatefulParent(el: HTMLElement): WickedStateRootContract | null {
  let parent: HTMLElement = el.parentElement;

  while (parent) {
    if ('__wickedState' in parent) {
      return parent as WickedStateRootContract;
    }

    parent = parent.parentElement;
  }

  return null;
}
