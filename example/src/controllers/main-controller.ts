import { controller, IntervalService } from 'wicked.js';
import { MainContext } from '../contracts/main-context';

controller('mainCtrl', function ($ctx: MainContext, interval: IntervalService) {
  $ctx.count = 0;

  $ctx.interval = null;

  $ctx.handleClick = function ($event) {
    $event.preventDefault();
    $ctx.count += 1;
  };

  $ctx.handleToggleCounting = function ($event) {
    $event.preventDefault();

    if ($ctx.interval === null) {
      $ctx.interval = interval.start(() => {
        $ctx.count += 1;
      }, 1000);
    } else {
      interval.clear($ctx.interval!);
      $ctx.interval = null;
    }
  };
});
