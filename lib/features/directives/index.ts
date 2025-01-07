import { onDirective } from './on';
import { refDirective } from './ref';
import {stateDirective} from './state';
import { showDirective } from './show';
import { textDirective } from './text';
import { whenDirective } from './when';
import { eachDirective } from './each';
import { modelDirective } from './model';
import { WickedStateDirectiveContract } from '../../utils/contracts';

export const directives: WickedStateDirectiveContract<any>[] = [
  stateDirective,
  whenDirective,
  eachDirective,
  refDirective,
  onDirective,
  textDirective,
  showDirective,
  modelDirective,
];

export function directive<T>(directive: WickedStateDirectiveContract<T>): WickedStateDirectiveContract<T> {
  if (directives.some((d) => d.name === directive.name)) {
      throw new Error(
          `[WickedState] Directive ${directive.name} is already registered`,
      );
  }

  directives.push(directive);

  directives.sort((a, b) => a.priority - b.priority);

  return directive;
}
