import {defaultReactivity} from './default';
import {WickedStateReactivityContract} from '../../utils/contracts';

export let reactivity: WickedStateReactivityContract = defaultReactivity;

export function setReactivity(newReactivity: WickedStateReactivityContract): WickedStateReactivityContract {
  const previousReactivity = reactivity;

  reactivity = newReactivity;

  return previousReactivity;
}
