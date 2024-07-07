import {
  WickedStateDirectiveContract,
  WickedStateElementContract,
} from '../../utils/contracts';
import { isFunction } from '../../utils/checkers';

export function whenDirective({ value, node, bindings, hydrate }: WickedStateDirectiveContract<boolean>) {
  if ( ! (node instanceof HTMLTemplateElement)) {
    throw new Error(
        '[WickedState] When directive can only be used on <template> elements.',
    );
  }

  if (Object.keys(bindings).length > 1) {
    throw new Error(
        '[WickedState] You cannot use other directives with the when directive.',
    );
  }

  const template = node as WickedStateElementContract & HTMLTemplateElement & {
    __wickedStateWhenElement?: WickedStateElementContract;
  };

  if ( ! value) {
    const whenElement = template.__wickedStateWhenElement;

    if (whenElement) {
      const destroyHandler = whenElement.__wickedStateObject?.destroy;

      if (isFunction(destroyHandler)) {
        destroyHandler();
      }

      const disconnectHandler = whenElement.__wickedStateDisconnect;

      if (isFunction(disconnectHandler)) {
        disconnectHandler();
      }

      whenElement.remove();

      template.__wickedStateWhenElement = null;
    }

    return;
  }

  if (template.__wickedStateWhenElement) {
    return;
  }

  const clone = template.content.cloneNode(true) as DocumentFragment;

  const firstElementChild = clone.firstElementChild as WickedStateElementContract;

  if ( ! firstElementChild) {
    throw new Error(
        '[WickedState] When directive requires a child element.',
    );
  }

  if ( ! firstElementChild.dataset.state) {
    firstElementChild.dataset.state = '{}';
  }

  template.after(firstElementChild);

  template.__wickedStateWhenElement = firstElementChild;

  hydrate();
}
