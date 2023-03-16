import { Context } from '../core/context';
import { isAsyncFn } from '../utils/is-async-fn';

export interface IntervalService {
  start(fn: Function, timeout?: number): number;
  clear(id: number): void;
}

export function intervalService($rootContext: Context): IntervalService {
  return {
    start(fn, timeout) {
      return setInterval(async function () {
        try {
          if (isAsyncFn(fn)) {
            await fn();
          } else {
            fn();
          }
        } finally {
          $rootContext.$notify();
        }
      }, timeout);
    },
    clear(id) {
      clearInterval(id);
    },
  };
}
