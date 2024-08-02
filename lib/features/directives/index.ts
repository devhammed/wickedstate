import { onDirective } from './on';
import { refDirective } from './ref';
import { showDirective } from './show';
import { textDirective } from './text';
import { whenDirective } from './when';
import { modelDirective } from './model';
import { WickedStateDirectiveHandlerContract } from '../../utils/contracts';

export const directives: Record<string, WickedStateDirectiveHandlerContract<any>> = {
  text: textDirective,
  on: onDirective,
  show: showDirective,
  when: whenDirective,
  ref: refDirective,
  model: modelDirective,
};

export function directive<T>(
    name: string,
    fn: WickedStateDirectiveHandlerContract<T>,
): void {
  if (typeof directives[name] === 'function') {
    throw new Error(
        `[WickedState] Overriding directive is not allowed, this error occurred while trying to set an existing directive for ${name}`,
    );
  }

  directives[name] = fn;
}
