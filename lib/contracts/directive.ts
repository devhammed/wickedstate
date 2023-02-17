import { Context } from '../core/context';

export interface Directive {
  newContext: boolean;
  isTemplate: boolean;
  priority: number;
  apply: (props: {
    el: Element;
    context: Context;
    exp: string;
    arg: string;
    modifiers: Record<string, boolean>;
  }) => void;
}
