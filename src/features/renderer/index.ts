import {domRenderer} from './dom';
import {WickedStateRendererContract} from '../../utils/contracts';

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
