import {domRenderer} from './dom';
import {WickedStateRendererContract} from "../../utils/contracts";

export let render: WickedStateRendererContract = domRenderer;

export function setRenderer(renderer: WickedStateRendererContract): WickedStateRendererContract {
    const previousRenderer = render;

    render = renderer;

    return previousRenderer;
}
