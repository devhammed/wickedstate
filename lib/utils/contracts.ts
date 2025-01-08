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
  __wickedStateCurrentElement?: WickedStateElementContract;
  __wickedStateCleanups?: Record<string, Function[]>;
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
  __wickedStateInLoop?: boolean;
  __wickedStateLoopItems?: Record<any, WickedStateLoopItemContract>;
}

export interface WickedStateLoopItemContract {
  key: any;
  value: any;
  el: WickedStateElementContract;
}

export interface WickedStateMagicContextContract {
  state: WickedStateObjectContract;
  root: WickedStateElementContract;
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
  handler: WickedStateDirectiveHandlerContract;
}

export interface WickedStateDirectiveContextContract {
  bindings: WickedStateDirectiveBindingContract[];
  state: WickedStateObjectContract;
  node: WickedStateElementContract;
  root: WickedStateElementContract;
  modifiers: Record<string, any>;
  type: string;
  value: string;
}

export interface WickedStateMagicHandlerContract<T> {
  (magic: WickedStateMagicContextContract): T;
}

export interface WickedStateDirectiveHandlerContract {
  (context: WickedStateDirectiveContextContract): Function | void;
}

export interface WickedStateEvaluatorContract {
  (expr: string, state: object, locals?: object): any;
}

export interface WickedStateRendererContract {
  (root: any): Promise<void>;
}
