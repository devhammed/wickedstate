import {WickedStateElementContract} from './contracts';

export function getStateRoot(node: WickedStateElementContract): WickedStateElementContract|null {
    let parent = node;

    while (parent) {
        if (parent.__wickedStateObject) {
            return parent;
        }

        parent = parent.parentElement;
    }

    return null;
}
