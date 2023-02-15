import { Context } from '../core/context';
import { service } from '../core/provider';

export interface IntervalService {
  start(fn: Function, timeout?: number): number;
  clear(id: number): void;
}

service('interval', function ($rootContext: Context): IntervalService {
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
});
