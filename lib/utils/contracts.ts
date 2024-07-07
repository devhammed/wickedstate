export interface WickedStateConfigContract {
  reactivity?: WickedStateReactivityContract;
}

export interface WickedStateReactivityContract {
  effect: WickedStateEffectContract;
  reactive: WickedStateReactiveContract;
}

export interface WickedStateEffectContract {
  (fn: Function): () => void;
}

export interface WickedStateReactiveContract {
  (target: Object): Object;
}

export interface WickedStateObjectContract extends Object {
  init?: Function;
  placeholder?: Function;
  destroy?: Function;
}

export interface WickedStateElementContract extends HTMLElement {
  __wickedStateObject?: WickedStateObjectContract;
  __wickedStateParent?: WickedStateElementContract;
  __wickedStateRefs?: Record<string, HTMLElement>;
  __wickedStatePlaceholder?: {
    el: HTMLElement,
    previousDisplay: string,
  };
  __wickedStateDisconnect?: () => void;
  __wickedStateEvents?: Record<string, {
    target: Window | Document | WickedStateElementContract,
    handler: EventListenerOrEventListenerObject
  }>;
}

export interface WickedStateMagicContextContract {
  state: WickedStateObjectContract;
  effect: WickedStateEffectContract;
  root: WickedStateElementContract;
  hydrate: () => void;
}

export interface WickedStateDirectiveContract<T> {
  bindings: Record<string, any>;
  state: WickedStateObjectContract;
  node: WickedStateElementContract;
  root: WickedStateElementContract;
  value: T;
  effect: WickedStateEffectContract;
  hydrate: () => void;
}

export interface WickedStateMagicHandlerContract<T> {
  (magic: WickedStateMagicContextContract): T;
}

export interface WickedStateDirectiveHandlerContract<T> {
  (directive: WickedStateDirectiveContract<T>): Function | void;
}
