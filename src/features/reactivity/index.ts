import {defaultReactivity} from './default';
import {WickedStateReactivityContract} from '../../utils/contracts';

/**
 * The reactivity engine used by WickedState.
 */
export let reactivity: WickedStateReactivityContract = defaultReactivity;

/**
 * Switch the reactivity engine.
 *
 * @example
 * ```ts
 * import { setReactivity } from 'wickedstate';
 * import { effect, reactive } from '@vue/reactivity';
 *
 * setReactivity({
 *   effect,
 *   reactive,
 * });
 * ```
 */
export function setReactivity(newReactivity: WickedStateReactivityContract): WickedStateReactivityContract {
  const previousReactivity = reactivity;

  reactivity = newReactivity;

  return previousReactivity;
}
