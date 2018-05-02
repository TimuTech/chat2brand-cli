class MessageConstants {
	constructor() {}

    static get FETCH_LIMIT() { return 200 } // max 200
    static get REPLY_REPEAT_LIMIT() { return 3 }
    static get DEFAULT_TRANSPORT() { return 'whatsapp' }
}

export default MessageConstants