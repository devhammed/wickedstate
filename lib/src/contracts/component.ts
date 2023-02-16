import { ComponentProp } from './component-prop';

export interface Component {
  props: ComponentProp[];
  template: string;
}
