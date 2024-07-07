import { onDirective } from './on';
import { refDirective } from './ref';
import { showDirective } from './show';
import { textDirective } from './text';
import { whenDirective } from './when';
import { DirectiveHandlerContract } from '../../utils/contracts';

export const directives: Record<string, DirectiveHandlerContract<any>> = {
  text: textDirective,
  on: onDirective,
  show: showDirective,
  when: whenDirective,
  ref: refDirective,
};

export function directive<T>(
    name: string,
    fn: DirectiveHandlerContract<T>,
): void {
  if (typeof directives[name] === 'function') {
    throw new Error(
        `[WickedState] Overriding directive is not allowed, this error occurred while trying to set an existing directive for ${name}`,
    );
  }

  directives[name] = fn;
}
