import clone from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import { getPaths } from '../utils/get-paths';
import { ContextWatcher } from '../contracts/context-watcher';
import { ContextWatcherFn } from '../contracts/context-watcher-fn';

export class Context {
  public $parent: Context | null;

  public $children: Context[] = [];

  public $watchers: ContextWatcher<any>[] = [];

  constructor(parent: Context | null = null) {
    this.$parent = parent;
  }

  public $new(): Context {
    const obj = new Context(this);

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
        this.$watchers.splice(index, 1);
      }
    };
  }

  public $eval<T>(
    exp: string,
    locals: Record<string, any> = {} as const
  ): T | null {
    return new Function(
      'ctx',
      'locals',
      `return (function eval() {
        // Declare context variables
        ${Object.keys(this)
          .map((k) => `var ${k};`)
          .join('\n')}

        // Declare local variables
        ${Object.keys(locals)
          .map((k) => `var ${k};`)
          .join('\n')}

        // Assign context variables
        ${Object.keys(this)
          .map((k) => `${k} = ctx['${k}'];`)
          .join('\n')}

        // Assign local variables
        ${Object.keys(locals)
          .map((k) => `${k} = locals['${k}'];`)
          .join('\n')}

        // Evaluate expression
        return ${exp};
      });`
    )(this, locals)();
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

      for (i = 0; i < this.$watchers.length; i += 1) {
        watcher = this.$watchers[i];

        current = this.$eval(watcher.exp);

        if (!isEqual(watcher.lastValue, current)) {
          watcher.lastValue = clone(current);
          dirty = true;
          watcher.fn(current);
        }
      }
    } while (dirty);

    for (i = 0; i < this.$children.length; i += 1) {
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
