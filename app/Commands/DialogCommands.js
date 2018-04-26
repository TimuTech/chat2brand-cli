import EventConstants from '../Constants/EventConstants';
import { prompt } from 'inquirer';

class DialogCommands {
	constructor(cli) {
        this.cli = cli;
	}

	define() {
        this.cli.command('transfer-dialogs')
                .option('-n, --client-named', 'Only transfer dialogs where the client is named')
                .alias('td')
                .description("Transfer one operator's dialogs to another")
                .action(async ({ clientNamed }) => {
                    let { operatorOne, operatorTwo } = await prompt(EventConstants.DIALOG_TRANSFER_PROMPT);

                    EventBus.emit(EventConstants.DIALOG_TRANSFER, { operatorOne, operatorTwo, clientNamed });
                });
    }
}

export default DialogCommands;