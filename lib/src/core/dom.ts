import { Context } from './context';
import { get, getDirective } from './provider';
import { Directive } from '../contracts/directive';
import { CompiledDirective } from '../contracts/compiled-directive';

function getElDirectives(el: Element): CompiledDirective[] {
  const attrs = el.attributes;
  const result: CompiledDirective[] = [];

  for (let i = 0; i < attrs.length; i += 1) {
    const name = attrs[i].name;
    const value = attrs[i].value;
    const providedDir = getDirective(name);

    if (providedDir !== null) {
      result.push({
        name,
        value,
      });
    }
  }

  return result;
}

export const STOP_COMPILING_ERROR = new Error('Stop compiling.');

export function bootstrap() {
  const root = document.documentElement ?? document.children[0];

  if (!root) {
    throw new Error('Root element not found');
  }

  compile(root, get('$rootContext') as Context);
}

export function compile(el: Element, context: Context) {
  let directive: Directive;
  let keepCompiling: boolean = true;
  let contextCreated: boolean = false;
  let compiledDirectives: CompiledDirective[] = getElDirectives(el);

  try {
    compiledDirectives.forEach(function (compiledDirective) {
      const providedDir = getDirective(compiledDirective.name);

      if (providedDir === null) {
        return;
      }

      directive = providedDir;

      if (directive.newContext && !contextCreated) {
        context = context.$new();
        contextCreated = true;
      }

      directive.apply(el, context, compiledDirective.value);

      if (directive.isTemplate) {
        throw STOP_COMPILING_ERROR;
      }
    });
  } catch (e) {
    if (e === STOP_COMPILING_ERROR) {
      keepCompiling = false;
    } else {
      throw e;
    }
  }

  if (keepCompiling) {
    [].slice
      .call(el.children)
      .forEach((child: Element) => compile(child, context));
  }
}
