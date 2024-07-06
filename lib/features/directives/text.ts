import { DirectiveContract } from '../../utils/contracts';

export function textDirective({ node, value }: DirectiveContract<string>): void {
  node.textContent = value;
}
