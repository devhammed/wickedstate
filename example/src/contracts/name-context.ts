import { Context } from 'wicked.js';

export type NameContext = Context & {
  newName: string;
  names: Array<string[]>;
  handleAddName: () => void;
};
