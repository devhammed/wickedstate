import {WickedStateDirectiveContract} from '../../utils/contracts';

export const confirmDirective: WickedStateDirectiveContract = {
  name: 'confirm',
  priority: -1,
  handler({ node, value, modifiers }): void {
    const message = value.replace('\\n', '\n');

    const shouldPrompt =  modifiers.prompt;

    node.__wickedStateConfirm = (action, instead) => {
      if (shouldPrompt) {
        let [question, expected] = message.split('|');

        if (! expected) {
          throw new Error('[WickedState]: Expected value is missing in the confirm directive.');
        }

        const input = prompt(question);

        if (input === expected) {
          return action();
        }

        return instead();
      }

      if (confirm(message)) {
        return action();
      }

      return instead();
    }
  },
};
