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
    template: `<h1 *bind:style="{ color: count >= 5 ? 'red' : 'blue' }">Count: {{ count }}, Doubled: {{count * 2}}</h1>`,
  };
}
