import {domRenderer} from './dom';
import {WickedStateRendererContract} from '../../utils/contracts';

/**
 * The renderer used to render the state.
 */
export let render: WickedStateRendererContract = domRenderer;

/**
 * The prefix used to identify the directives.
 */
export let prefix: string = '*';

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
    const previousPrefix = prefix;

    prefix = newPrefix;

    return previousPrefix;
}
