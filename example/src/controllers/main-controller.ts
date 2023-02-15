import { controller, IntervalService } from 'wicked.js';
import { MainContext } from '../contracts/main-context';

controller('mainCtrl', function ($ctx: MainContext, interval: IntervalService) {
  $ctx.count = 0;

  $ctx.interval = null;

  $ctx.toggleText = 'Start Counting';

  $ctx.handleClick = function ($event) {
    $event.preventDefault();
    $ctx.count += 1;
  };

  $ctx.handleToggleCounting = function ($event) {
    $event.preventDefault();

    if ($ctx.interval === null) {
      $ctx.toggleText = 'Stop Counting';
      $ctx.interval = interval.start(() => {
        $ctx.count += 1;
      }, 1000);
    } else {
      $ctx.toggleText = 'Start Counting';
      interval.clear($ctx.interval!);
      $ctx.interval = null;
    }
  };
});
