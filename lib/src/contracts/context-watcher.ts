export type ContextWatcherFn<T> = (value: T | null) => void;

export interface ContextWatcher<T> {
  exp: string;
  fn: ContextWatcherFn<T>;
  lastValue: T;
}
