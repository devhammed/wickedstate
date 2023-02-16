import { Context } from '../core/context';

export interface IntervalService {
  start(fn: Function, timeout?: number): number;
  clear(id: number): void;
}

export function intervalService($rootContext: Context): IntervalService {
  return {
    start(fn, timeout) {
      return setInterval(function () {
        fn();
        $rootContext.$notify();
      }, timeout);
    },
    clear(id) {
      clearInterval(id);
    },
  };
}
