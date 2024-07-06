export interface WickedStateContract {
    init?: Function;
}

export interface WickedStateConfigContract {
    reactivity?: ReactivityContract;
}

export interface MagicHandlerContract<T> {
    (magic: MagicContract): T;
}

export interface DirectiveHandlerContract<T> {
    (directive: DirectiveContract<T>): void;
}

export interface EffectContract {
    (fn: Function): void;
}

export interface ReactiveContract {
    (target: Object): Object;
}

export interface MagicContract {
    state: Object;

    effect: EffectContract;
}

export interface ReactivityContract {
    effect: EffectContract;

    reactive: ReactiveContract;
}

export interface DirectiveContract<T> {
    context: Object;

    state: Object;

    node: HTMLElement;

    value: T;

    effect: EffectContract;
}
