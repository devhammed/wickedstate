import { Context } from 'wicked.js';

export type SecretContext = Context & {
  isShowing: boolean;

  handleToggle: () => void;
};
