import { WickedStateMagicContextContract } from '../../utils/contracts';

export function getMagic({ state }: WickedStateMagicContextContract): (
    path: string,
) => any {
  return function getMagicHandler(path: string, defaultValue: any = null): any {
    return path.replace(/\[(\w+)]/g, '.$1').
        replace(/^\./, '').
        split('.').reduce(
            (acc: { [x: string]: any; }, currentKey: string | number) => (acc &&
                acc[currentKey]) ?? defaultValue,
            state,
        );
  };
}
