import { ContextExpression } from './context-expression';

export interface CompiledDirective {
  name: string;
  value: ContextExpression;
}
