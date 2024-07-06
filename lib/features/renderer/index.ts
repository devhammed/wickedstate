import {directives} from '../directives';
import {walkDom} from '../../utils/walk-dom';
import {decorateWithMagics} from '../magics';
import {evaluate} from '../../utils/evaluate';
import {isFunction} from '../../utils/checkers';
import {defaultReactivity} from '../reactivity';
import {WickedStateContract, WickedStateConfigContract} from '../../utils/contracts';

export async function start(config: WickedStateConfigContract = {}): Promise<void> {
    const states: NodeListOf<HTMLElement> = document.querySelectorAll('[data-state]');

    if ( ! config.reactivity) {
        config.reactivity = defaultReactivity;
    }

    for (let i = 0; i < states.length; i++) {
        const stateElement = states[i];

        const stateExpression = stateElement.dataset.state;

        if ( ! stateExpression.trim()) {
            continue;
        }

        const data = evaluate<object>(stateExpression, {});

        const state: WickedStateContract = decorateWithMagics({
            state: config.reactivity.reactive(data),
            effect: config.reactivity.effect,
        });

        if (isFunction(state.init)) {
            const initValue = state.init();

            if (initValue instanceof Promise) {
                await initValue;
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
    }
}
