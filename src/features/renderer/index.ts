import {domRenderer} from './dom';
import {WickedStateRendererContract} from '../../utils/contracts';

/**
 * The prefix used to identify the directives.
 */
let prefixAsString: string = '*';

/**
 * The renderer used to render the state.
 */
export let render: WickedStateRendererContract = domRenderer;

/**
 * Set the renderer to use.
 *
 * @example
 * ```ts
 * import { setRenderer } from 'wickedstate';
 *
 * setRenderer((root) => {
 *  // Custom rendering logic
 * });
 * ```
 */
export function setRenderer(renderer: WickedStateRendererContract): WickedStateRendererContract {
    const previousRenderer = render;

    render = renderer;

    return previousRenderer;
}

/**
 * Set the prefix to use.
 *
 * @example
 * ```ts
 * import { setPrefix } from 'wickedstate';
 *
 * setPrefix('data-');
 * ```
 */
export function setPrefix(newPrefix: string): string {
    const previousPrefix = prefixAsString;

    prefixAsString = newPrefix;

    return previousPrefix;
}

/**
 * Get the prefix used.
 *
 * @example
 * ```ts
 * import { prefix } from 'wickedstate';
 *
 * console.log(prefix()); // '*'
 *
 * console.log(prefix('cloak')); // '*cloak'
 * ```
 */
export function prefix(append: string = ''): string {
    return prefixAsString + append;
}
