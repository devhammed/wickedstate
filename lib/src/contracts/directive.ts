import { Context } from '../core/context';
import { ContextExpression } from './context-expression';

export interface Directive {
  newContext?: boolean;
  apply: (el: Element, context: Context, exp: ContextExpression) => void;
}
