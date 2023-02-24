import { Context } from '../core/context';

export interface Compiler {
  (el: Element, context: Context): void;
}
