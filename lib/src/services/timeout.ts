import { Context } from '../core/context';

export interface TimeoutService {
  start(fn: Function, timeout?: number): number;
  clear(id: number): void;
}

export function timeoutService($rootContext: Context): TimeoutService {
  return {
    start(fn, timeout) {
      return setTimeout(function () {
        fn();
        $rootContext.$notify();
      }, timeout);
    },
    clear(id) {
      clearTimeout(id);
    },
  };
}
