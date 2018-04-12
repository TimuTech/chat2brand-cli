require('./bootstrap');

import MessageCommands from './Commands/MessageCommands';
import MessageHandler from './Handlers/MessageHandler';

const cli = require('commander');
cli.version(process.env.npm_package_version)
    .description(process.env.npm_package_description);

(new MessageCommands(cli)).define();
(new MessageHandler).listen();

cli.parse(process.argv);