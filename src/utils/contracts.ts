/**
 * A wicked state object contract.
 *
 * This is the object that is used to manage the state of the application.
 */
export interface WickedStateObjectContract extends Object {
  /**
   * The init function is called when the object is created.
   */
  init?: Function;

  /**
   * The destroy function is called when the object is destroyed.
   */
  destroy?: Function;

  /**
   * The $el property holds reference to the current element being processed.
   */
  $el?: WickedStateElementContract | null;

  /**
   * The $root property holds reference to the root element.
   */
  $root?: WickedStateElementContract | null;

  /**
   * The $data property holds reference to the data object.
   */
  $data?: WickedStateObjectContract | null;

  /**
   * The $parent property holds reference to the parent state object (if any).
   */
  $parent?: WickedStateElementContract | null;

  /**
   * The $effect property is used to create a reactive effect.
   */
  $effect?: WickedStateEffectContract;

  /**
   * The $watch property is used to watch a property for changes.
   */
  $watch?: <T>(
      selector: string,
      fn: (value: T, oldValue: T) => void,
  ) => void;

  /**
   * The $refs property holds reference to the elements with the `ref` attribute
   */
  $refs?: Record<string, HTMLElement>;

  /**
   * The $set property is used to set a value in the data object using dot notation.
   */
  $set?: <T>(path: string, value: T) => void;

  /**
   * The $get property is used to get a value from the data object using dot notation.
   */
  $get?: <T>(path: string, defaultValue?: T | null) => T;
}

/**
 * A wicked state element contract.
 *
 * These are the properties attached to a DOM element that is managed by Wicked State.
 */
export interface WickedStateElementContract extends HTMLElement {
  __wickedStateObject?: WickedStateObjectContract;
  __wickedStateProcessed?: boolean;
  __wickedStateCurrentElement?: WickedStateElementContract;
  __wickedStateCleanups?: Record<string, Function[]>;
  __wickedStateRefs?: Record<string, WickedStateElementContract>;
  __wickedStateDisconnect?: () => void;
  __wickedStateWhenElement?: WickedStateElementContract;
  __wickedStateInLoop?: boolean;
  __wickedStateLoopItems?: Record<any, WickedStateLoopItemContract>;
  __wickedStateIgnore?: boolean;
  __wickedStateIgnoreSelf?: boolean;
}

/**
 * The loop item contract.
 */
export interface WickedStateLoopItemContract {
  key: any;
  value: any;
  el: WickedStateElementContract;
}

/**
 * The magic context contract.
 *
 * The cleanup function is called whenever the element that used the magic is removed from the DOM.
 */
export interface WickedStateMagicContextContract {
  state: WickedStateObjectContract;
  root: WickedStateElementContract;
  cleanup: (fn: Function) => void;
}

/**
 * The directive contract.
 */
export interface WickedStateDirectiveContract {
  name: string;
  priority: number;
  handler: WickedStateDirectiveHandlerContract;
}

/**
 * The directive binding contract.
 */
export interface WickedStateDirectiveBindingContract {
  name: string;
  type: string;
  value: string;
  modifiers: Record<string, any>;
  handler: WickedStateDirectiveHandlerContract;
}

/**
 * This is the compiled context that is passed to the directive handler.
 */
export interface WickedStateDirectiveContextContract {
  bindings: WickedStateDirectiveBindingContract[];
  state: WickedStateObjectContract;
  node: WickedStateElementContract;
  root: WickedStateElementContract;
  modifiers: Record<string, any>;
  type: string;
  value: string;
}

/**
 * The magic handler contract.
 *
 * The magic handler is called when the magic is used in an expression.
 */
export interface WickedStateMagicHandlerContract<T> {
  (magic: WickedStateMagicContextContract): T;
}

/**
 * The directive handler contract.
 *
 * The directive handler is called when the directive is found in the DOM.
 *
 * You can return a cleanup function to be called when the directive is removed from the DOM.
 */
export interface WickedStateDirectiveHandlerContract {
  (context: WickedStateDirectiveContextContract): Function | void;
}

/**
 * The expression evaluator contract.
 *
 * The library ships with an expression evaluator for JavaScript that uses Function constructor, but you can create your own evaluator to support any environment.
 */
export interface WickedStateEvaluatorContract {
  (expr: string, state: object, locals?: object): any;
}

/**
 * The renderer contract.
 *
 * The library ships with a renderer for the DOM, but you can create your own renderer to support any environment.
 */
export interface WickedStateRendererContract {
  (root: any): Promise<void>;
}

/**
 * The reactivity contract.
 *
 * This is the contract that is used to create reactive effects and reactive objects.
 */
export interface WickedStateReactivityContract {
  effect: WickedStateEffectContract;
  reactive: WickedStateReactiveContract;
}

/**
 * A wicked state effect contract.
 */
export interface WickedStateEffectContract {
  (fn: Function): () => void;
}

/**
 * A wicked state reactive contract.
 */
export interface WickedStateReactiveContract {
  (target: Object): Object;
}
