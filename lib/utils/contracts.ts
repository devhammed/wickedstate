export interface WickedStateConfigContract {
  reactivity?: WickedStateReactivityContract;
}

export interface WickedStateReactivityContract {
  effect: WickedStateEffectContract;
  reactive: WickedStateReactiveContract;
  cleanup: (obj: object, fn: Function) => void;
  dispose: (obj: object) => void;
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
  $watch?: <T>(
      selector: () => T,
      fn: (newValue: T, oldValue: T) => void,
  ) => void;
  $root?: WickedStateElementContract | null;
  $data?: WickedStateObjectContract;
  $parent?: WickedStateElementContract | null;
  $effect?: WickedStateEffectContract;
  $refs?: Record<string, HTMLElement>;
  $set?: <T>(path: string, value: T) => void;
  $get?: <T>(path: string, defaultValue?: T | null) => T;
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
  __wickedStateWhenElement?: WickedStateElementContract;
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
