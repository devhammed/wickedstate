import {directives} from '../directives';
import {walkDom} from '../../utils/walk-dom';
import {decorateWithMagics} from '../magics';
import {evaluate} from '../../utils/evaluate';
import {isFunction} from '../../utils/checkers';
import {defaultReactivity} from '../reactivity';
import {WickedStateContract, WickedStateConfigContract} from '../../utils/contracts';

interface WickedStateElementContract extends HTMLElement {
    __wickedStatePlaceholder?: {
        placeholder: HTMLElement,
        previousDisplay: string
    };
}

export async function start(config: WickedStateConfigContract = {}): Promise<void> {
    const states: NodeListOf<HTMLElement> = document.querySelectorAll('[data-state]');

    if ( ! config.reactivity) {
        config.reactivity = defaultReactivity;
    }

    for (let i = 0; i < states.length; i++) {
        (async function (stateElement): Promise<void> {
            const stateExpression = stateElement.dataset.state;

            if ( ! stateExpression.trim()) {
                return;
            }

            const data = evaluate<object>(stateExpression, {});

            const state: WickedStateContract = decorateWithMagics({
                state: config.reactivity.reactive(data),
                effect: config.reactivity.effect,
            });

            if (isFunction(state.init)) {
                const initValue = state.init();

                if (initValue instanceof Promise) {
                    const placeholderContent = isFunction(state.placeholder) ? state.placeholder() : null;

                    if (placeholderContent) {
                        const placeholder = stateElement.cloneNode() as HTMLElement;

                        placeholder.removeAttribute('data-state');

                        placeholder.removeAttribute('data-bind');

                        placeholder.innerHTML = placeholderContent;

                        stateElement.parentElement.insertBefore(placeholder, stateElement);

                        stateElement.__wickedStatePlaceholder = {
                            placeholder,
                            previousDisplay: stateElement.style.display,
                        };

                        stateElement.style.display = 'none';
                    }

                    try {
                        await initValue;
                    } finally {
                        const placeholderDetails = stateElement.__wickedStatePlaceholder;

                        if (placeholderDetails) {
                            stateElement.parentElement.removeChild(placeholderDetails.placeholder);
                            stateElement.style.display = placeholderDetails.previousDisplay;
                            stateElement.__wickedStatePlaceholder = null;
                        }
                    }
                }
            }

            walkDom(stateElement, function(node: Node) {
                if ( ! (node instanceof HTMLElement)) {
                    return;
                }

                const bindings = node.dataset.bind;

                if ( ! bindings) {
                    return;
                }

                const cleanups: Set<Function> = new Set();

                config.reactivity.effect(() => {
                    const context = evaluate<object>(bindings, state);

                    cleanups.forEach((fx) => {
                        fx();
                        cleanups.delete(fx);
                    });

                    for (const key in context) {
                        if ({}.hasOwnProperty.call(context, key)) {
                            const value = context[key];

                            const directive = directives[key];

                            if (typeof directive === 'undefined') {
                                throw new Error(`[WickedState] Unknown directive encountered: ${key}`);
                            }

                            const cleanup = directive({
                                context,
                                value,
                                node,
                                state,
                                effect: config.reactivity.effect,
                            });

                            if (isFunction(cleanup)) {
                                cleanups.add(cleanup as Function);
                            }
                        }
                    }
                });
            });
        })(states[i] as WickedStateElementContract);
    }
}
