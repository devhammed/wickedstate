import { onDirective } from './on';
import { ifDirective } from './if';
import { refDirective } from './ref';
import { forDirective } from './for';
import { htmlDirective } from './html';
import { showDirective } from './show';
import { textDirective } from './text';
import { cloakDirective } from './cloak';
import { stateDirective } from './state';
import { modelDirective } from './model';
import { WickedStateDirectiveContract } from '../../utils/contracts';

/**
 * List of directives.
 */
export const directives: WickedStateDirectiveContract[] = [
  cloakDirective,
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

/**
 * Register a directive.
 *
 * The directive with the lowest priority will be executed first e.g `*state` has a priority of `0` to make sure other directives can access the state object when they are executed.
 *
 * So if you want to do something before the state directive is executed, you can set the priority of your directive to a negative number else set to 1 or higher.
 *
 * @example
 * ```ts
 * import { directive } from 'wickedstate';
 *
 * directive({
 *   name: 'logger',
 *   priority: -1,
 *   handler: ({ node }) => {
 *       console.log(node);
 *    },
 * });
 * ```
 */
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
