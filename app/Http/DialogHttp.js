class DialogHttp {
	constructor() {
		this.prefix = config.api.url + 'dialogs/'
	}

    get(id = '') { return axios.get(this.prefix + id) }
    getDialogs(params = {}) { return axios.get(this.prefix, { params }) }
	updateDialog(id, { operator_id, state }) { return axios.put(this.prefix + id, { operator_id, state }) }
}

export default DialogHttp;