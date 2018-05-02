import EventConstants from '../Constants/EventConstants';
import MessageConstants from '../Constants/MessageConstants';
import DialogConstants from '../Constants/DialogConstants';
import UIConstants from '../Constants/UIConstants';
import CacheConstants from '../Constants/CacheConstants';
import MessageHttp from '../Http/MessageHttp';
import DialogHttp from '../Http/DialogHttp';
import ClientHttp from '../Http/ClientHttp';
import _cliProgress from 'cli-progress';

class DialogHandler {
    constructor() {
        this.messageHttp = new MessageHttp;
        this.dialogHttp = new DialogHttp;
        this.clientHttp = new ClientHttp;
        this.transferAll = this.transferAll.bind(this); // So that `this` refers to the class 'instance'
    }
    
    async transferAll({ operatorOne, operatorTwo, clientNamed, clientUnnamed }) {
        let limit = DialogConstants.FETCH_LIMIT;
        let type = 'from_client';
        let state = DialogConstants.STATE_CLOSED;
        let loadingBar = new _cliProgress.Bar({}, _cliProgress.Presets.shades_classic);

        if (!operatorOne || !operatorTwo) {
            console.error(UIConstants.ERROR_COLOUR, "Need to specify both operator IDs");
            process.exit(1);
        }
       
        try {
            console.log(UIConstants.INFO_COLOUR, `Transfer dialogs from operator ${operatorOne} to ${operatorTwo} ...`);
            loadingBar.start(DialogConstants.TRANSFER_REPEAT_LIMIT * limit, 0);
            for (let k = 0; k < DialogConstants.TRANSFER_REPEAT_LIMIT; ++k) {
                let { data } = await this.dialogHttp.getDialogs({ operator_id: operatorOne, limit });

                if (!data.data.length) break;

                while (data.data.length) {
                    let dialog = data.data.shift();

                    try {
                        let message = (await this.messageHttp.get(dialog.last_message.id)).data.data;
                        let client = (await this.clientHttp.get(message.client_id)).data.data;

                        if (clientNamed) {
                            if (client.assigned_name || (client.name && client.name.match(/^[a-z]+$/i))) // is alpha (name)
                                await this.dialogHttp.updateDialog(message.dialog_id, { operator_id: operatorTwo, state }); 
                        }
                        else if (clientUnnamed) {
                            if (!client.assigned_name)
                                await this.dialogHttp.updateDialog(message.dialog_id, { operator_id: operatorTwo, state }); 
                        }
                        else {
                            await this.dialogHttp.updateDialog(message.dialog_id, { operator_id: operatorTwo, state });
                        }
                        loadingBar.increment();
                    }
                    catch (error) {
                        console.error(UIConstants.ERROR_COLOUR, error);
                    }
                }   
            }
        }
        catch (error) {
            console.error(UIConstants.ERROR_COLOUR, error);
            process.exit(1);
        }
        loadingBar.stop();
        console.log(UIConstants.INFO_COLOUR, `Done transferring dialogs ...`);
        process.exit();
    }

	listen() {
        EventBus.on(EventConstants.DIALOG_TRANSFER, this.transferAll);
    }
}

export default DialogHandler;