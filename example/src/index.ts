import { App } from 'wicked.js';
import { MainController } from './controllers/main-controller';
import { NameController } from './controllers/name-controller';
import { SecretController } from './controllers/secret-controller';

new App()
  .controller('mainCtrl', MainController)
  .controller('nameCtrl', NameController)
  .controller('secretCtrl', SecretController)
  .component('counterHeader', () => {
    return {
      props: [
        {
          type: Number,
          name: 'count',
        },
      ],
      template: `<h1 *bind="count"></h1>`,
    };
  })
  .component('userItem', () => {
    return {
      props: [
        {
          name: 'name',
          type: (val: string[]) => val,
        },
      ],
      template: `
        <span *for="part in name">
          <span
            *if="$first"
            *for="ch in part.split('')"
            *bind="ch + ($last ? '' : '-')"></span>
          <span *if="$last" *bind="part"></span>
        </span>
      `,
    };
  })
  .start();
