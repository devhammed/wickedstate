import { Component } from 'wicked.js';

export function CounterHeader(): Component {
  return {
    props: [
      {
        as: Number,
        name: 'count',
        isRequired: true,
      },
    ],
    template: `<h1 *bind="count"></h1>`,
  };
}
