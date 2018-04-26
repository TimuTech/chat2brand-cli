require('./bootstrap');

import MessageCommands from './Commands/MessageCommands';
import MessageHandler from './Handlers/MessageHandler';
import DialogCommands from './Commands/DialogCommands';
import DialogHandler from './Handlers/DialogHandler';

const cli = require('commander');
cli.version(process.env.npm_package_version)
    .description(process.env.npm_package_description);

(new MessageCommands(cli)).define();
(new MessageHandler).listen();
(new DialogCommands(cli)).define();
(new DialogHandler).listen();

cli.parse(process.argv);