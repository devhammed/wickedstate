import { Context } from './context';
import { annotate } from '../utils/annotate';
import { ifDirective } from '../directives/if';
import { forDirective } from '../directives/for';
import { bindDirective } from '../directives/bind';
import { Directive } from '../contracts/directive';
import { htmlDirective } from '../directives/html';
import { modelDirective } from '../directives/model';
import { clickDirective } from '../directives/click';
import { timeoutService } from '../services/timeout';
import { intervalService } from '../services/interval';
import { controllerDirective } from '../directives/controller';
import { makeDirectiveName } from '../utils/make-directive-name';
import { makeControllerName } from '../utils/make-controller-name';
import { CompiledDirective } from '../contracts/compiled-directive';

export class App {
  private $rootContext: Context;

  private $stopCompilingError: Error;

  private $cache: Record<string, any>;

  private $providers: Record<string, Function>;

  constructor() {
    this.$providers = {};

    this.$rootContext = new Context(this);

    this.$stopCompilingError = new Error('Stop compiling.');

    this.$cache = {
      $app: this,
      $rootCtx: this.$rootContext,
      $rootContext: this.$rootContext,
      $compile: this.compile.bind(this),
    };

    this.registerAppBindings();
  }

  directive(name: string, fn: () => Directive): this {
    this.$providers[makeDirectiveName(name)] = fn;

    return this;
  }

  controller(name: string, fn: Function): this {
    this.$providers[makeControllerName(name)] = function () {
      return fn;
    };

    return this;
  }

  service(name: string, fn: Function): this {
    this.$providers[name] = fn;

    return this;
  }

  get<T>(name: string, locals?: Record<string, any> | null): T | null {
    if (this.$cache[name]) {
      return this.$cache[name] as T;
    }

    const provider = this.$providers[name];

    if (!provider || typeof provider !== 'function') {
      return null;
    }

    return (this.$cache[name] = this.invoke<T>(provider, locals));
  }

  getDirective(name: string, locals?: Record<string, any>): Directive | null {
    return this.get<Directive>(makeDirectiveName(name), locals);
  }

  getController(name: string, locals?: Record<string, any>): Function | null {
    return this.get<Function>(makeControllerName(name), locals);
  }

  invoke<T>(fn: Function, locals?: Record<string, any> | null): T {
    const normalizedLocals = locals ?? {};

    const deps = annotate(fn).map(
      (s) => normalizedLocals[s] ?? this.get(s, normalizedLocals)
    );

    return fn.apply(null, deps) as T;
  }

  start() {
    const root = document.documentElement ?? document.children[0];

    if (!root) {
      throw new Error('Root element not found');
    }

    this.compile(root, this.get<Context>('$rootContext'));
  }

  private compile(el: Element, context: Context) {
    let directive: Directive;
    let contextCreated: boolean;
    let compiledDirectives: CompiledDirective[] = this.getElDirectives(el);

    try {
      compiledDirectives.forEach((compiledDirective) => {
        const providedDir = this.getDirective(compiledDirective.name);

        if (providedDir === null) {
          return;
        }

        directive = providedDir;

        if (directive.newContext && !contextCreated) {
          context = context.$new();
          contextCreated = true;
        }

        directive.apply({
          el,
          context,
          exp: compiledDirective.value,
        });

        if (directive.isTemplate) {
          throw this.$stopCompilingError;
        }
      });

      [].slice
        .call(el.children)
        .forEach((child: Element) => this.compile(child, context));
    } catch (e) {
      if (e !== this.$stopCompilingError) {
        throw e;
      }
    }
  }

  private getElDirectives(el: Element): CompiledDirective[] {
    const attrs = el.attributes;
    const result: CompiledDirective[] = [];

    for (let i = 0; i < attrs.length; i += 1) {
      const name = attrs[i].name;
      const value = attrs[i].value;
      const providedDir = this.getDirective(name);

      if (providedDir !== null) {
        result.push({
          name,
          value,
        });
      }
    }

    return result;
  }

  private registerAppBindings(): void {
    // Register Directives
    this.directive('*if', ifDirective);
    this.directive('*for', forDirective);
    this.directive('*bind', bindDirective);
    this.directive('*html', htmlDirective);
    this.directive('*model', modelDirective);
    this.directive('@click', clickDirective);
    this.directive('*controller', controllerDirective);

    // Register Services
    this.service('$timeout', timeoutService);
    this.service('$interval', intervalService);
  }
}
