import { Component } from 'wicked.js';

export function UserItem(): Component {
  return {
    props: [
      {
        name: 'name',
        isRequired: true,
      },
    ],
    template: `
      <span *for="part in name">
        <span
          *if="$first"
          *for="ch in part.split('')">{{ ch + ($last ? '' : '-') }}</span>
        <span *if="$last">{{ part }}</span>
      </span>
    `,
  };
}
