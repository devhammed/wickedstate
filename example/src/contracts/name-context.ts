import { Context } from 'wicked.js';

export type NameContext = Context & {
  names: Array<string[]>;

  newName: string;

  handleAddName: () => void;
};
