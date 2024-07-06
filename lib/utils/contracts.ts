export interface WickedStateContract {
    init?: Function;
    placeholder?: Function;
}

export interface WickedStateConfigContract {
    reactivity?: ReactivityContract;
}

export interface ReactivityContract {
    effect: EffectContract;

    reactive: ReactiveContract;
}

export interface WickedStateElementContract extends HTMLElement {
    __wickedStatePlaceholder: {
        placeholder: HTMLElement,
        previousDisplay: string,
    } | null;
}

export interface MagicHandlerContract<T> {
    (magic: MagicContextContract): T;
}

export interface DirectiveHandlerContract<T> {
    (directive: DirectiveContract<T>): Function | void;
}

export interface EffectContract {
    (fn: Function): void;
}

export interface ReactiveContract {
    (target: Object): Object;
}

export interface MagicContextContract {
    state: Object;

    effect: EffectContract;

    root: WickedStateElementContract | null;
}

export interface DirectiveContract<T> {
    bindings: Object;

    state: Object;

    node: HTMLElement;

    root: WickedStateElementContract | null;

    value: T;

    effect: EffectContract;
}
