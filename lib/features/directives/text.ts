import { WickedStateDirectiveContract } from '../../utils/contracts';

export function textDirective({ node, value }: WickedStateDirectiveContract<string>): void {
  node.textContent = value;
}
