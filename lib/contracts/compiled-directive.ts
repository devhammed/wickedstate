import { Directive } from './directive';

export interface CompiledDirective {
  exp: string;
  arg: string;
  directive: Directive;
  modifiers: Record<string, boolean>;
}
