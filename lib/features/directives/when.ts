import {
  DirectiveContract,
  WickedStateNodeContract,
} from '../../utils/contracts';

export function whenDirective({ value, node, bindings, hydrate }: DirectiveContract<boolean>) {
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

  const template = node as WickedStateNodeContract & HTMLTemplateElement & {
    __wickedStateWhenElement?: WickedStateNodeContract;
  };

  if ( ! value) {
    const whenElement = template.__wickedStateWhenElement;

    if (whenElement) {
      whenElement.__wickedStateDisconnect();
      whenElement.remove();
      template.__wickedStateWhenElement = null;
    }

    return;
  }

  if (template.__wickedStateWhenElement) {
    return;
  }

  const clone = template.content.cloneNode(true) as DocumentFragment;

  const firstElementChild = clone.firstElementChild as WickedStateNodeContract;

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
