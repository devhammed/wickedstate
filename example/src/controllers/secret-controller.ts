import { controller } from 'wicked.js';
import { SecretContext } from '../contracts/secret-context';

controller('secretCtrl', function ($ctx: SecretContext) {
  $ctx.isShowing = false;

  $ctx.handleToggle = function () {
    $ctx.isShowing = !$ctx.isShowing;
  };
});
