import { invoke } from './provider';
import { clone } from '../utils/clone';
import { isEqual } from '../utils/is-equal';
import { ContextWatcher } from '../contracts/context-watcher';
import { ContextWatcherFn } from '../contracts/context-watcher-fn';
import { ContextExpression } from '../contracts/context-expression';

export class Context {
  public $$parent: Context | null;

  public $$children: Context[] = [];

  public $$watchers: ContextWatcher<any>[] = [];

  constructor(parent: Context | null = null) {
    this.$$parent = parent;
  }

  public $new(): Context {
    const obj = new Context(this);

    Object.setPrototypeOf(obj, this);

    this.$$children.push(obj);

    return obj;
  }

  public $watch<T>(exp: ContextExpression, fn: ContextWatcherFn<T>): void {
    this.$$watchers.push({
      exp,
      fn,
      lastValue: clone(this.$eval(exp)),
    });
  }

  public $eval<T>(
    exp: ContextExpression,
    locals: Record<string, any> = {} as const
  ): T | null {
    const fnContext = { $context: this, $ctx: this, ...locals };

    if (typeof exp === 'function') {
      return invoke(exp, fnContext);
    }

    let value: any = this.$get(exp);

    return typeof value === 'function' ? invoke(value, fnContext) : value;
  }

  public $get<T>(path: string): T | null {
    return path
      .replace(/\[(\w+)\]/g, '.$1')
      .replace(/^\./, '')
      .split('.')
      .reduce((p, c) => (p && p[c]) ?? null, this as any);
  }

  public $set<T>(path: string, value: T): T {
    return path
      .replace(/\[(\w+)\]/g, '.$1')
      .replace(/^\./, '')
      .split('.')
      .reduce(
        (acc, part, index) =>
          (acc[part] =
            path.split('.').length === ++index ? value : acc[part] ?? {}),
        this as any
      );
  }

  public $notify(): void {
    let i: number;
    let current: any;
    let dirty: boolean;
    let watcher: ContextWatcher<any>;

    do {
      dirty = false;

      for (i = 0; i < this.$$watchers.length; i += 1) {
        watcher = this.$$watchers[i];

        current = this.$eval(watcher.exp);

        if (!isEqual(watcher.lastValue, current)) {
          watcher.lastValue = clone(current);
          dirty = true;
          watcher.fn(current);
        }
      }
    } while (dirty);

    for (i = 0; i < this.$$children.length; i += 1) {
      this.$$children[i].$notify();
    }
  }

  public $destroy(): void {
    const parent = this.$$parent;

    if (parent === null) {
      return;
    }

    const children = parent.$$children;

    children.splice(children.indexOf(this), 1);
  }
}
