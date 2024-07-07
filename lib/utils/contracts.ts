export interface WickedStateContract {
  init?: Function;
  placeholder?: Function;
}

export interface WickedStateConfigContract {
  reactivity?: ReactivityContract;
}

export interface ReactivityContract {
  effect: EffectContract;
  reactive: ReactiveContract;
}

export interface WickedStateRootContract extends HTMLElement {
  __wickedState?: Object;
  __wickedStateParent?: WickedStateRootContract;
  __wickedRefs?: Record<string, HTMLElement>;
  __wickedStatePlaceholder?: {
    placeholder: HTMLElement,
    previousDisplay: string,
  };
}

export interface WickedStateNodeContract extends HTMLElement {
  __wickedStateDisconnect: () => void;
}

export interface MagicHandlerContract<T> {
  (magic: MagicContextContract): T;
}

export interface DirectiveHandlerContract<T> {
  (directive: DirectiveContract<T>): Function | void;
}

export interface EffectContract {
  (fn: Function): () => void;
}

export interface ReactiveContract {
  (target: Object): Object;
}

export interface MagicContextContract {
  state: Object;
  effect: EffectContract;
  root: WickedStateRootContract | null;
  hydrate: () => void;
}

export interface DirectiveContract<T> {
  bindings: Object;
  state: Object;
  node: WickedStateNodeContract;
  root: WickedStateRootContract | null;
  value: T;
  effect: EffectContract;
  hydrate: () => void;
}
