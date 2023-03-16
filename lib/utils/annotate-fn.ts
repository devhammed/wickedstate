const ARGS_REGEX = /\((.*?)\)/;

const COMMENTS_REGEX = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;

export function annotateFn(fn: Function): string[] {
  const res = fn.toString().replace(COMMENTS_REGEX, '').match(ARGS_REGEX);

  if (res && res[1]) {
    return res[1].split(',').map((arg) => arg.trim());
  }

  return [];
}
