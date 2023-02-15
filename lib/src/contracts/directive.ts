import { Context } from '../core/context';

export interface Directive {
  newContext: boolean;
  isTemplate: boolean;
  apply: (el: Element, context: Context, exp: string) => void;
}
