export { magic } from './features/magics';

export { start } from './features/renderer';

export { evaluator, setEvaluator } from './features/evaluator';

export { directive } from './features/directives';

export { setReactivity } from './features/reactivity';

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
