import {evaluator} from '../evaluator';
import {WickedStateDirectiveContract, WickedStateElementContract} from '../../utils/contracts';

function addMiddleware(callback: EventListener, wrapper: (cb: EventListener, e: Event) => any): EventListener {
  return function(e: Event): any {
    return wrapper(callback, e);
  };
}

function parseDuration(duration: string): number {
  const units = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
  };

  const match = duration.match(/^(\d+)(ms|s|m)$/);

  if ( ! match) {
    throw new Error('[WickedState]: Invalid duration format. Use a number followed by a valid unit (ms, s, or m).');
  }

  const value = parseInt(match[1], 10);

  const unit = match[2];

  return value * units[unit];
}

function debounce(func: EventListener, wait: number): EventListener {
  let timeout: number|null;

  return function(...args: any[]) {
    const context = this;

    const later = function () {
      timeout = null;

      func.apply(context, args);
    };

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
  };
}

function throttle(func: EventListener, limit: number): EventListener {
  let inThrottle: boolean = false;

  return function(...args: any[]) {
    if ( ! inThrottle) {
      func.apply(this, args);

      inThrottle = true;

      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export const onDirective: WickedStateDirectiveContract = {
  name: 'on',
  priority: 2,
  handler({ root, node, value, state, modifiers, type }): () => void {
    let target: WickedStateElementContract|Window|Document = node;

    let options: AddEventListenerOptions = {};

    let eventHandler: EventListener = function(e: Event): any {
      const previousElement = root.__wickedStateCurrentElement;

      try {
          root.__wickedStateCurrentElement = node;

          const evaluatedValue = evaluator(value, state, { $event: e });

          return evaluatedValue instanceof Function
              ? evaluatedValue.call(state, e)
              : evaluatedValue;
      } finally {
        root.__wickedStateCurrentElement = previousElement;
      }
    };

    if (modifiers.once) {
      eventHandler = addMiddleware(eventHandler, (callback, e) => {
        try {
          return callback(e);
        } finally {
          target.removeEventListener(type, eventHandler, options);
        }
      });
    }

    if (modifiers.prevent) {
      eventHandler = addMiddleware(eventHandler, (callback, e) => {
        e.preventDefault();

        return callback(e);
      });
    }

    if (modifiers.stop) {
      eventHandler = addMiddleware(eventHandler, (callback, e) => {
        e.stopPropagation();
        return callback(e);
      });
    }

    if (modifiers.window) {
      target = window;
    }

    if (modifiers.document) {
      target = document;
    }

    if (modifiers.self) {
      eventHandler = addMiddleware(eventHandler, (callback, e) => {
        if (e.target === node) {
          return callback(e);
        }
      });
    }

    if (modifiers.debounce) {
      eventHandler = debounce(eventHandler, parseDuration(modifiers.debounce));
    }

    if (modifiers.throttle) {
      eventHandler = throttle(eventHandler, parseDuration(modifiers.throttle));
    }

    if (modifiers.passive) {
      options.passive = true;
    }

    if (modifiers.capture) {
      options.capture = true;
    }

    if (modifiers.away) {
      target = document;

      eventHandler = addMiddleware(eventHandler, (callback, e) => {
        const eventTarget = e.target as Node;

        if (node.contains(eventTarget)) {
          return;
        }

        if (! eventTarget.isConnected) {
          return;
        }

        if (node.style.display === 'none') {
          return;
        }

        return callback(e);
      });
    }

    if (modifiers.esc) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === 'Escape') {
              return callback(e);
            }
        });
    }

    if (modifiers.enter) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === 'Enter') {
              return callback(e);
            }
        });
    }

    if (modifiers.space) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === ' ') {
              return callback(e);
            }
        });
    }

    if (modifiers.tab) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === 'Tab') {
              return callback(e);
            }
        });
    }

    if (modifiers.meta || modifiers.cmd || modifiers.super) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.metaKey) {
              return callback(e);
            }
        });
    }

    if (modifiers.ctrl) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.ctrlKey) {
              return callback(e);
            }
        });
    }

    if (modifiers.alt) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.altKey) {
              return callback(e);
            }
        });
    }

    if (modifiers.shift) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.shiftKey) {
              return callback(e);
            }
        });
    }

    if (modifiers.backspace) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === 'Backspace') {
              return callback(e);
            }
        });
    }

    if (modifiers.delete) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === 'Delete') {
              return callback(e);
            }
        });
    }

    if (modifiers.caps) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === 'CapsLock') {
              return callback(e);
            }
        });
    }

    if (modifiers.slash) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === '/') {
              return callback(e);
            }
        });
    }

    if (modifiers.period) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === '.') {
              return callback(e);
            }
        });
    }

    if (modifiers.equal) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === '=') {
              return callback(e);
            }
        });
    }

    if (modifiers.comma) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === ',') {
              return callback(e);
            }
        });
    }

    if (modifiers.up) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === 'ArrowUp') {
              return callback(e);
            }
        });
    }

    if (modifiers.down) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === 'ArrowDown') {
              return callback(e);
            }
        });
    }

    if (modifiers.left) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === 'ArrowLeft') {
              return callback(e);
            }
        });
    }

    if (modifiers.right) {
        eventHandler = addMiddleware(eventHandler, (callback, e) => {
            if (e instanceof KeyboardEvent && e.key === 'ArrowRight') {
              return callback(e);
            }
        });
    }

    target.addEventListener(type, eventHandler, options);

    return () => {
        target.removeEventListener(type, eventHandler, options);
    };
  },
};
