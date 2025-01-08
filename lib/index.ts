export { magic } from './features/magics';

export { data } from './features/datas';

export { directive } from './features/directives';

export { render, setRenderer } from './features/renderer';

export { evaluator, setEvaluator } from './features/evaluator';

export { reactivity, setReactivity } from './features/reactivity';

export { domRenderer } from './features/renderer/dom';

export { functionEvaluator } from './features/evaluator/function';

export { defaultReactivity } from './features/reactivity/default';

export type {
  WickedStateReactivityContract,
  WickedStateDirectiveHandlerContract,
  WickedStateEffectContract,
  WickedStateMagicContextContract,
  WickedStateReactiveContract,
  WickedStateDirectiveContract,
  WickedStateDirectiveContextContract,
  WickedStateMagicHandlerContract,
  WickedStateObjectContract,
  WickedStateEvaluatorContract,
  WickedStateRendererContract,
  WickedStateDirectiveBindingContract,
  WickedStateElementContract,
  WickedStateLoopItemContract,
} from './utils/contracts';
