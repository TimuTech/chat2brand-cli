class MessageHttp {
	constructor() {
		this.prefix = config.api.url + 'messages/'
	}

	sendMessage(data) { return axios.post(this.prefix, data) }
	getMessages(params) { return axios.get(this.prefix, { params: params }) }
	markRead(id) { return axios.get(`${this.prefix + id}/read`) }
}

export default MessageHttp;