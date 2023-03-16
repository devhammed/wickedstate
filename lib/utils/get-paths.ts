const DOT_REGEX = /^\./;
const SUBSCRIPT_SYNTAX_REGEX = /\[(\w+)\]/g;

export function getPaths(path: string): string[] {
  return path
    .replace(SUBSCRIPT_SYNTAX_REGEX, '.$1')
    .replace(DOT_REGEX, '')
    .split('.');
}
