import { ContextWatcherFn } from './context-watcher-fn';

export interface ContextWatcher<T> {
  exp: string;
  fn: ContextWatcherFn<T>;
  lastValue: T;
}
