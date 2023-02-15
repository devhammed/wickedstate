import { ContextExpression } from './context-expression';
import { ContextWatcherFn } from './context-watcher-fn';

export interface ContextWatcher<T> {
  exp: ContextExpression;
  fn: ContextWatcherFn<T>;
  lastValue: T;
}
