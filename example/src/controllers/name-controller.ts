import { NameContext } from '../contracts/name-context';

export function NameController($ctx: NameContext) {
  $ctx.newName = '';

  $ctx.names = [
    ['John', 'Doe'],
    ['Jane', 'Doe'],
    ['John', 'Smith'],
    ['Jane', 'Smith'],
  ];

  $ctx.handleAddName = function () {
    if ($ctx.newName === '') {
      return;
    }

    const parts = $ctx.newName.split(' ');

    if (parts.length !== 2) {
      alert('Please enter a first and last name');
      return;
    }

    $ctx.names.push([parts[0], parts[1]]);

    $ctx.newName = '';
  };
}
