class MessageHttp {
	constructor() {
		this.prefix = config.api.url + 'messages/'
	}

	get(id = '') { return axios.get(this.prefix + id) }
	sendMessage(data) { return axios.post(this.prefix, data) }
	getMessages(params = {}) { return axios.get(this.prefix, { params }) }
	markRead(id) { return axios.get(`${this.prefix + id}/read`) }
}

export default MessageHttp;