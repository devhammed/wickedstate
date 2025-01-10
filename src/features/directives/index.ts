import { onDirective } from './on';
import { ifDirective } from './if';
import { refDirective } from './ref';
import { forDirective } from './for';
import { htmlDirective } from './html';
import { showDirective } from './show';
import { textDirective } from './text';
import { stateDirective } from './state';
import { modelDirective } from './model';
import { WickedStateDirectiveContract } from '../../utils/contracts';

export const directives: WickedStateDirectiveContract[] = [
  stateDirective,
  ifDirective,
  forDirective,
  refDirective,
  onDirective,
  textDirective,
  htmlDirective,
  showDirective,
  modelDirective,
];

export function directive(directive: WickedStateDirectiveContract): WickedStateDirectiveContract {
  if (directives.some((d) => d.name === directive.name)) {
      throw new Error(
          `[WickedState] Directive ${directive.name} is already registered`,
      );
  }

  directives.push(directive);

  directives.sort((a, b) => a.priority - b.priority);

  return directive;
}
