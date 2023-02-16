import { App } from './app';
import clone from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import { getPaths } from '../utils/get-paths';
import { ContextWatcher, ContextWatcherFn } from '../contracts/context-watcher';

export class Context {
  public $app: App;

  public $parent: Context | null;

  public $children: Context[] = [];

  public $watchers: Array<ContextWatcher<any> | null> = [];

  constructor(app: App, parent: Context | null = null) {
    this.$app = app;
    this.$parent = parent;
  }

  public $new(): Context {
    const obj = new Context(this.$app, this);

    Object.setPrototypeOf(obj, this);

    this.$children.push(obj);

    return obj;
  }

  public $watch<T>(exp: string, fn: ContextWatcherFn<T>): () => void {
    const watcher = {
      exp,
      fn,
      lastValue: clone(this.$eval(exp)),
    };

    this.$watchers.push(watcher);

    return () => {
      const index = this.$watchers.indexOf(watcher);

      if (index >= 0) {
        this.$watchers[index] = null;
      }
    };
  }

  public $eval<T>(
    exp: string,
    locals: Record<string, any> = {} as const
  ): T | null {
    const env: Record<string, any> = {};

    for (const key in this) {
      env[key] = this[key];
    }

    for (const key in locals) {
      env[key] = locals[key];
    }

    return new Function(
      'env',
      `
        function eval() {
          // Declare env variables
          ${Object.keys(env)
            .map((k) => `var ${k} = env.${k};`)
            .join('\n')}

          // Evaluate expression
          return ${exp};
        }

        return eval();
      `
    )(env);
  }

  public $get<T>(path: string): T | null {
    return getPaths(path).reduce(
      (acc, currentKey) => (acc && acc[currentKey]) ?? null,
      this as any
    );
  }

  public $set<T>(path: string, value: T): T {
    return getPaths(path).reduce(
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

      for (i = 0; i < this.$watchers.length; i++) {
        watcher = this.$watchers[i];

        if (watcher === null) {
          this.$watchers.splice(i, 1);
          i -= 1;
          continue;
        }

        current = this.$eval(watcher.exp);

        if (!isEqual(watcher.lastValue, current)) {
          watcher.lastValue = clone(current);
          dirty = true;
          watcher.fn(current);
        }
      }
    } while (dirty);

    for (i = 0; i < this.$children.length; i++) {
      this.$children[i].$notify();
    }
  }

  public $destroy(): void {
    const parent = this.$parent;

    if (parent === null) {
      return;
    }

    const children = parent.$children;

    children.splice(children.indexOf(this), 1);
  }
}
