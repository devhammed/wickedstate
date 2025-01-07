export { magic } from './features/magics';

export { directive } from './features/directives';

export { render, setRenderer } from './features/renderer';

export { evaluator, setEvaluator } from './features/evaluator';

export { reactivity, setReactivity } from './features/reactivity';

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
} from './utils/contracts';
