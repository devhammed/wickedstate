import { serialize } from './serialize';

export function isEqual(a: any, b: any): boolean {
  return serialize(a) === serialize(b);
}
