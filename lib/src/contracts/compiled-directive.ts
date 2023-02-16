import { Directive } from './directive';

export interface CompiledDirective {
  exp: string;
  directive: Directive;
}
