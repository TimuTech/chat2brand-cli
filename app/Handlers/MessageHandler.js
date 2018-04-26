import EventConstants from '../Constants/EventConstants';
import MessageConstants from '../Constants/MessageConstants';
import UIConstants from '../Constants/UIConstants';
import CacheConstants from '../Constants/CacheConstants';
import MessageHttp from '../Http/MessageHttp';
import _cliProgress from 'cli-progress';

class MessageHandler {
    constructor() {
        this.http = new MessageHttp;
        this.broadcastReply = this.broadcastReply.bind(this);  // So that `this` refers to the class 'instance'
        this.sendMessage = this.sendMessage.bind(this);  // So that `this` refers to the class 'instance'
    }

    async broadcastReply({ unread, message  }) {
        let read = !unread;
        let limit = MessageConstants.FETCH_LIMIT;
        let channel_id = config.api.channel_id; 
        let type = 'from_client';
        let response = {};
        let loadingBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);
        let replied = [];
        let increase = 0;

        console.log(UIConstants.INFO_COLOUR, `Broadcasting a reply to chats ...`);
        loadingBar.start(MessageConstants.REPLY_REPEAT_LIMIT * limit, 0);
        try {
            for (let k = 0; k < MessageConstants.REPLY_REPEAT_LIMIT; ++k) {
                if (unread) response = await this.http.getMessages({ read, limit, channel_id, type });
                else        response = await this.http.getMessages({ limit, channel_id, type });

                let cacheReplied = await cache.getAsync(CacheConstants.KEY_CLIENTS_REPLIED);
                replied = cacheReplied ? cacheReplied.split(',') : [];
                let data = response.data;

                if (!data.data.length) break;
                
                while(data.data.length) {
                    let chatMessage = data.data.shift();
                    let client_id = chatMessage.client_id;
                    let text = message;
                    loadingBar.increment();

                    // Check from the cache if we haven't already replied to them
                    if (!replied.includes(client_id)) {
                        try {
                            await this.sendMessage({ client_id, text });
                            await this.http.markRead(chatMessage.id);
                            replied.push(client_id);
                            ++increase;
                        }
                        catch (error) {
                            console.error(UIConstants.ERROR_COLOUR, error);
                        }  
                    }
                }
                await cache.setAsync(CacheConstants.KEY_CLIENTS_REPLIED, replied.join(), CacheConstants.LIFETIME);
            }
        }
        catch (error) {
            console.error(UIConstants.ERROR_COLOUR, error);
            process.exit(1);
        }
        loadingBar.stop();
        console.log(UIConstants.INFO_COLOUR, `Done broadcasting reply.\nIncreased by ${increase}.\nReplied to ${replied.length} clients total.`);
        process.exit();
    }
    
    async sendMessage({ client_id, text }) {
        let transport = MessageConstants.DEFAULT_TRANSPORT;
        let channel_id = config.api.channel_id; 

        console.log(UIConstants.INFO_COLOUR, `Sending message to client ${client_id} ...`);
        try {
            await this.http.sendMessage({
                client_id,
                channel_id,
                transport,
                text
            });
        }
        catch (error) {
            console.error(UIConstants.ERROR_COLOUR, error);
        }
        console.log(UIConstants.INFO_COLOUR, `Done sending message.`);
    }

	listen() {
        EventBus.on(EventConstants.MESSAGE_SEND, this.sendMessage);
        EventBus.on(EventConstants.MESSAGE_BROADCAST_REPLY, this.broadcastReply);
    }
}

export default MessageHandler;