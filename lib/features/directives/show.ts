import { WickedStateDirectiveContract } from '../../utils/contracts';

export function showDirective({ value, node }: WickedStateDirectiveContract<boolean>) {
  if ( ! value) {
    node.style.display = 'none';

    return () => node.style.display = '';
  }

  node.style.display = '';

  return () => node.style.display = 'none';
}
