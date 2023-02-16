export function annotate(fn: Function): string[] {
  const res = fn
    .toString()
    .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, '')
    .match(/\((.*?)\)/);

  if (res && res[1]) {
    return res[1].split(',').map((d) => d.trim());
  }

  return [];
}
