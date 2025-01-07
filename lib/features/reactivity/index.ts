import {effect, reactive, cleanup, dispose} from './default';
import {WickedStateReactivityContract} from '../../utils/contracts';

export let reactivity: WickedStateReactivityContract = {
  effect,
  reactive,
  cleanup,
  dispose,
};

export function setReactivity(newReactivity: WickedStateReactivityContract) {
  reactivity = newReactivity;
}
