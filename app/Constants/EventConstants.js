class EventConstants {
	constructor() {}

    static get MESSAGE_SEND() { return 'message-send' }
    static get MESSAGE_SEND_PROMPT() {
        return [
            {
                type : 'input',
                name : 'client_id',
                message : 'Enter client ID: '
            },
            {
                type : 'editor',
                name : 'message',
                message : 'Enter message to send: '
            }
        ]
    }
    static get MESSAGE_BROADCAST_REPLY() { return 'message-broadcast-reply' }
    static get MESSAGE_BROADCAST_PROMPT() {
        return [{
            type : 'editor',
            name : 'message',
            message : 'Enter message to broadcast: '
        }]
    }
    static get DIALOG_TRANSFER() { return 'dialog-transfer' }
    static get DIALOG_TRANSFER_PROMPT() {
        return [
            {
                type : 'input',
                name : 'operatorOne',
                message : 'Enter first operator ID: '
            },
            {
                type : 'input',
                name : 'operatorTwo',
                message : 'Enter second operator ID: '
            }
        ]
    }
}

export default EventConstants