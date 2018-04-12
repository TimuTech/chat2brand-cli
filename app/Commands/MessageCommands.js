import EventConstants from '../Constants/EventConstants';
import { prompt } from 'inquirer';

class MessageCommands {
	constructor(cli) {
        this.cli = cli;
	}

	define() {
		this.cli.command('send-message')
                .alias('sm')
                .description('Send message to a client')
                .action(async () => {
                    let { client_id, message } = await prompt(EventConstants.MESSAGE_SEND_PROMPT);

                    EventBus.emit(EventConstants.MESSAGE_SEND, { client_id, message });
                });

        this.cli.command('broadcast-reply')
                .option('-u, --unread', 'Broadcast only to unread chats')
                .alias('br')
                .description('Broadcast a reply to all chats')
                .action(async (cmd) => {
                    let unread = cmd.unread || false;
                    let { message } = await prompt(EventConstants.MESSAGE_BROADCAST_PROMPT);

                    EventBus.emit(EventConstants.MESSAGE_BROADCAST_REPLY, { message, unread });
                });
    }
}

export default MessageCommands;