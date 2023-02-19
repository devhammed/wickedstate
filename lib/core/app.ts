import { Context } from './context';
import { ifDirective } from '../directives/if';
import { refDirective } from '../directives/ref';
import { forDirective } from '../directives/for';
import { Component } from '../contracts/component';
import { bindDirective } from '../directives/bind';
import { Directive } from '../contracts/directive';
import { htmlDirective } from '../directives/html';
import { eventDirective } from '../directives/event';
import { modelDirective } from '../directives/model';
import { timeoutService } from '../services/timeout';
import { intervalService } from '../services/interval';
import { componentDirective } from '../directives/component';
import { controllerDirective } from '../directives/controller';
import { CompiledDirective } from '../contracts/compiled-directive';

export class App {
  private $rootContext: Context;

  private $stopCompilingSignal: Error;

  private $cache: Record<string, any>;

  private $providers: Record<string, Function>;

  private $CONTROLLER_PREFIX = 'Controller_';

  private $COMPONENT_PREFIX = 'Component_';

  private $DIRECTIVE_PREFIX = 'Directive_';

  private $TEMPLATE_EXPR_REGEX = /{{ *?(.*?) *?}}/g;

  constructor() {
    this.$providers = {};

    this.$rootContext = new Context(this);

    this.$stopCompilingSignal = new Error('Stop compiling.');

    this.$cache = {
      $app: this,
      $rootCtx: this.$rootContext,
      $rootContext: this.$rootContext,
      $compile: this.compile.bind(this),
    };

    this.registerAppBindings();
  }

  directive(name: string, fn: () => Directive): this {
    this.$providers[this.makeDirectiveName(name)] = fn;

    return this;
  }

  controller(name: string, fn: Function): this {
    this.$providers[this.makeControllerName(name)] = function () {
      return fn;
    };

    return this;
  }

  component(name: string, fn: () => Component): this {
    this.$providers[this.makeComponentName(name)] = fn;

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
    return this.get<Directive>(this.makeDirectiveName(name), locals);
  }

  getController(name: string, locals?: Record<string, any>): Function | null {
    return this.get<Function>(this.makeControllerName(name), locals);
  }

  getComponent(name: string, locals?: Record<string, any>): Component | null {
    return this.get<Component>(this.makeComponentName(name), locals);
  }

  invoke<T>(fn: Function, locals?: Record<string, any> | null): T {
    const normalizedLocals = locals ?? {};

    const deps = this.annotate(fn).map(
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

  private annotate(fn: Function): string[] {
    const res = fn
      .toString()
      .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, '')
      .match(/\((.*?)\)/);

    if (res && res[1]) {
      return res[1].split(',').map((d) => d.trim());
    }

    return [];
  }

  private compile(el: Element, context: Context): void {
    try {
      // Setup variables...
      let contextCreated = false;
      let compiledDirectives = this.getElDirectives(el);

      // Then, apply directives...
      compiledDirectives.forEach(({ directive, exp, modifiers, arg }) => {
        if (directive.newContext && !contextCreated) {
          context = context.$new();
          contextCreated = true;
        }

        directive.apply({
          el,
          exp,
          arg,
          context,
          modifiers,
        });

        if (directive.isTemplate) {
          throw this.$stopCompilingSignal;
        }
      });

      // Then, evaluate template string...
      for (let i = 0, nodes = el.childNodes, len = nodes.length; i < len; i++) {
        const textNode = nodes[i] as ChildNode & {
          $$template: string;
        };

        if (textNode.nodeType !== Node.TEXT_NODE) {
          continue;
        }

        const exprs = [];

        textNode.$$template = textNode.nodeValue;

        textNode.nodeValue = textNode.$$template.replace(
          this.$TEMPLATE_EXPR_REGEX,
          (_, exp) => {
            const normalizedExp = exp.trim();

            exprs.push(normalizedExp);

            return context.$eval(normalizedExp);
          }
        );

        exprs.forEach((expr) => {
          context.$watch(expr, () => {
            textNode.nodeValue = textNode.$$template.replace(
              this.$TEMPLATE_EXPR_REGEX,
              (_, exp) => context.$eval(exp)
            );
          });
        });
      }

      // And then, traverse children.
      [].slice
        .call(el.children)
        .forEach((child: Element) => this.compile(child, context));
    } catch (e) {
      if (e !== this.$stopCompilingSignal) {
        throw e;
      }
    }
  }

  private getElDirectives(el: Element): CompiledDirective[] {
    const attrs = el.attributes;
    const result: CompiledDirective[] = [];

    for (let i = 0; i < attrs.length; i++) {
      const { name, value: exp } = attrs[i];
      const [_, directiveName, __, arg, modifiers] =
        /^([\w\-@*#$]+)(\:([\w-]+))?((?:\.[\w-]+)+)?$/.exec(name) ?? [];
      const directive = this.getDirective(directiveName);

      if (directive !== null) {
        result.push({
          exp,
          arg,
          directive,
          modifiers:
            modifiers
              ?.split('.')
              .reduce(
                (acc, item) => (item ? ((acc[item] = true), acc) : acc),
                {}
              ) ?? {},
        });
      }
    }

    result.sort((a, b) => b.directive.priority - a.directive.priority);

    return result;
  }

  private makeComponentName(name: string): string {
    return this.$COMPONENT_PREFIX + name;
  }

  private makeControllerName(name: string): string {
    return this.$CONTROLLER_PREFIX + name;
  }

  private makeDirectiveName(name: string): string {
    return this.$DIRECTIVE_PREFIX + name;
  }

  private registerAppBindings(): void {
    // Register Context Directives
    this.directive('*if', ifDirective);
    this.directive('*for', forDirective);
    this.directive('*bind', bindDirective);
    this.directive('*html', htmlDirective);
    this.directive('*model', modelDirective);
    this.directive('*controller', controllerDirective);

    // Register Referencing Directives
    this.directive('#ref', refDirective);
    this.directive('#component', componentDirective);

    // Register Event Directives
    this.directive(`@`, eventDirective);

    // Register Services
    this.service('$timeout', timeoutService);
    this.service('$interval', intervalService);
  }
}
