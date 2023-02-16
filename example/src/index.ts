import { App } from 'wicked.js';
import { UserItem } from './components/user-item';
import { CounterHeader } from './components/counter-header';
import { MainController } from './controllers/main-controller';
import { NameController } from './controllers/name-controller';
import { SecretController } from './controllers/secret-controller';

new App()
  .component('userItem', UserItem)
  .component('counterHeader', CounterHeader)
  .controller('mainCtrl', MainController)
  .controller('nameCtrl', NameController)
  .controller('secretCtrl', SecretController)
  .start();
