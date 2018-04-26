class ClientHttp {
	constructor() {
		this.prefix = config.api.url + 'clients/'
	}

	get(id = '') { return axios.get(this.prefix + id) }
}

export default ClientHttp;