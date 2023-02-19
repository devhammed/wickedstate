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
    template: `<h1>Count: {{ count }}, Doubled: {{count * 2}}</h1>`,
  };
}
