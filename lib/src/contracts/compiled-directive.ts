import { Directive } from './directive';

export interface CompiledDirective {
  name: string;
  value: string;
  directive: Directive;
}
