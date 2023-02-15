import { controller } from 'wicked.js';
import { NameContext } from '../contracts/name-context';

controller('nameCtrl', function ($ctx: NameContext) {
  $ctx.newName = '';

  $ctx.names = ['Hammed', 'Chicken Head Princess'];

  $ctx.handleAddName = function () {
    if ($ctx.newName === '') {
      return;
    }

    $ctx.names.push($ctx.newName);
    $ctx.newName = '';
  };
});
