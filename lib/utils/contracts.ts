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

export interface WickedStateLoopContract<T> {
    item: T;
    index: number;
    iteration: number;
    even: boolean;
    odd: boolean;
    first: boolean;
    last: boolean;
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
  __wickedStateLoop?: WickedStateLoopContract<any>;
}

export interface WickedStateMagicContextContract {
  state: WickedStateObjectContract;
  effect: WickedStateEffectContract;
  root: WickedStateElementContract;
  hydrate: () => void;
}

export interface WickedStateDirectiveContract {
  name: string;
  priority: number;
  handler: WickedStateDirectiveHandlerContract;
}

export interface WickedStateDirectiveBindingContract {
  name: string;
  type: string;
  value: string;
  modifiers: Record<string, any>;
}

export interface WickedStateDirectiveContextContract {
  bindings: WickedStateDirectiveBindingContract[];
  state: WickedStateObjectContract;
  node: WickedStateElementContract;
  root: WickedStateElementContract;
  value: string;
  effect: WickedStateEffectContract;
  hydrate: () => void;
}

export interface WickedStateMagicHandlerContract<T> {
  (magic: WickedStateMagicContextContract): T;
}

export interface WickedStateDirectiveHandlerContract {
  (context: WickedStateDirectiveContextContract): Function | void;
}

export interface WickedStateEvaluatorContract {
  (expr: string, context: object): any;
}
