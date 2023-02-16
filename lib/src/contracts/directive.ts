import { App } from '../core/app';
import { Context } from '../core/context';

export interface Directive {
  newContext: boolean;
  isTemplate: boolean;
  apply: (props: { el: Element; context: Context; exp: string }) => void;
}
