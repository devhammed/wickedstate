import { Context } from '../core/context';
import { service } from '../core/provider';

export interface TimeoutService {
  start(fn: Function, timeout?: number): number;
  clear(id: number): void;
}

service('timeout', function ($rootContext: Context): TimeoutService {
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
});
