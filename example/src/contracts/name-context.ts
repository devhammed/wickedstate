import { Context } from 'wicked.js';

export type NameContext = Context & {
  names: string[];

  newName: string;

  handleAddName: () => void;
};
