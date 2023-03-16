import { Context } from '../core/context';
import { isAsyncFn } from '../utils/is-async-fn';

export interface TimeoutService {
  start(fn: Function, timeout?: number): number;
  clear(id: number): void;
}

export function timeoutService($rootContext: Context): TimeoutService {
  return {
    start(fn, timeout) {
      return setTimeout(async function () {
        try {
          if (isAsyncFn(fn)) {
            await fn();
          } else {
            fn();
          }
        } finally {
          $rootContext.$notify();
        }
        $rootContext.$notify();
      }, timeout);
    },
    clear(id) {
      clearTimeout(id);
    },
  };
}
