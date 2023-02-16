import { App } from 'wicked.js';
import { MainController } from './controllers/main-controller';
import { NameController } from './controllers/name-controller';
import { SecretController } from './controllers/secret-controller';

new App()
  .controller('mainCtrl', MainController)
  .controller('nameCtrl', NameController)
  .controller('secretCtrl', SecretController)
  .start();
