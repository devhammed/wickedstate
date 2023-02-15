import { Context } from './context';
import { Directive } from '../contracts/directive';
import { makeDirectiveName } from '../utils/make-directive-name';
import { makeControllerName } from '../utils/make-controller-name';

const $rootContext = new Context();

const $cache: Record<string, any> = {
  $rootContext,
  $rootCtx: $rootContext,
};

const $providers: Record<string, Function> = {};

export function directive(name: string, fn: () => Directive) {
  $providers[makeDirectiveName(name)] = fn;
}

export function controller(name: string, fn: Function) {
  $providers[makeControllerName(name)] = function () {
    return fn;
  };
}

export function service(name: string, fn: Function) {
  $providers[name] = fn;
}

export function get<T>(
  name: string,
  locals?: Record<string, any> | null
): T | null {
  if ($cache[name]) {
    return $cache[name] as T;
  }

  const provider = $providers[name];

  if (!provider || typeof provider !== 'function') {
    return null;
  }

  return ($cache[name] = invoke<T>(provider, locals));
}

export function getDirective(
  name: string,
  locals?: Record<string, any>
): Directive | null {
  return get<Directive>(makeDirectiveName(name), locals);
}

export function getController(
  name: string,
  locals?: Record<string, any>
): Function | null {
  return get<Function>(makeControllerName(name), locals);
}

export function annotate(fn: Function): string[] {
  const res = fn
    .toString()
    .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, '')
    .match(/\((.*?)\)/);

  if (res && res[1]) {
    return res[1].split(',').map((d) => d.trim());
  }

  return [];
}

export function invoke<T>(
  fn: Function,
  locals?: Record<string, any> | null
): T {
  const normalizedLocals = locals ?? {};

  const deps = annotate(fn).map(
    (s) => normalizedLocals[s] ?? get(s, normalizedLocals)
  );

  return fn.apply(null, deps) as T;
}
