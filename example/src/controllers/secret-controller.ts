import { SecretContext } from '../contracts/secret-context';

export function SecretController($ctx: SecretContext) {
  $ctx.isShowing = false;

  $ctx.handleToggle = function () {
    $ctx.isShowing = !$ctx.isShowing;
  };
}
